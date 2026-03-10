import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContentPlan } from './entities/content-plan.entity';
import { ContentPlanItem } from './entities/content-plan-item.entity';
import { GeneratePlanDto, UpdatePlanItemDto } from './dto/generate-plan.dto';
import { ContentPlanStatus, PlanItemStatus } from '../common/enums';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class ContentPlansService {
  private readonly logger = new Logger(ContentPlansService.name);

  constructor(
    @InjectRepository(ContentPlan)
    private readonly planRepo: Repository<ContentPlan>,
    @InjectRepository(ContentPlanItem)
    private readonly itemRepo: Repository<ContentPlanItem>,
    private readonly realtimeService: RealtimeService,
  ) {}

  async generate(userId: number, dto: GeneratePlanDto): Promise<ContentPlan> {
    const isWeekly = dto.type === 'weekly';
    const days = isWeekly ? 7 : 30;
    const start = dto.startDate ? new Date(dto.startDate) : new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + days);

    const plan = this.planRepo.create({
      userId,
      type: dto.type,
      startDate: start,
      endDate: end,
      status: ContentPlanStatus.DRAFT,
      generationParams: { type: dto.type, days },
    });

    const savedPlan = await this.planRepo.save(plan);

    const platforms = ['instagram', 'facebook', 'whatsapp'];
    const goals = ['promotion', 'engagement', 'awareness', 'festival', 'offer'];
    const items: Partial<ContentPlanItem>[] = [];

    for (let d = 0; d < days; d++) {
      const day = new Date(start);
      day.setDate(day.getDate() + d);

      const platformIdx = d % platforms.length;
      const goalIdx = d % goals.length;

      items.push({
        planId: savedPlan.id,
        day,
        timeSlot: '19:00',
        platform: platforms[platformIdx],
        contentGoal: goals[goalIdx],
        suggestedCaption: `AI-generated caption for ${goals[goalIdx]} on ${platforms[platformIdx]}`,
        suggestedHashtags: `#${goals[goalIdx]} #businesspro #content`,
        status: PlanItemStatus.SUGGESTED,
        order: d,
      });
    }

    await this.itemRepo.save(items.map((i) => this.itemRepo.create(i)));

    this.realtimeService.planGenerated(userId, savedPlan.id);

    return this.findById(userId, savedPlan.id);
  }

  async findAll(userId: number) {
    return this.planRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['items'],
    });
  }

  async findById(userId: number, id: number): Promise<ContentPlan> {
    const plan = await this.planRepo.findOne({
      where: { id, userId },
      relations: ['items'],
    });
    if (!plan) throw new NotFoundException('Content plan not found');
    return plan;
  }

  async updateItem(
    userId: number,
    planId: number,
    itemId: number,
    dto: UpdatePlanItemDto,
  ): Promise<ContentPlanItem> {
    await this.findById(userId, planId);

    const item = await this.itemRepo.findOne({ where: { id: itemId, planId } });
    if (!item) throw new NotFoundException('Plan item not found');

    Object.assign(item, dto);
    return this.itemRepo.save(item);
  }

  async approveAll(userId: number, planId: number): Promise<ContentPlan> {
    const plan = await this.findById(userId, planId);

    plan.status = ContentPlanStatus.ACTIVE;
    plan.approvedAt = new Date();
    await this.planRepo.save(plan);

    await this.itemRepo.update(
      { planId, status: PlanItemStatus.SUGGESTED },
      { status: PlanItemStatus.APPROVED },
    );

    return this.findById(userId, planId);
  }

  async cancel(userId: number, planId: number): Promise<void> {
    const plan = await this.findById(userId, planId);
    plan.status = ContentPlanStatus.CANCELLED;
    await this.planRepo.save(plan);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async publishScheduledContent() {
    const now = new Date();
    const dueItems = await this.itemRepo
      .createQueryBuilder('item')
      .innerJoinAndSelect('item.plan', 'plan')
      .where('item.status = :status', { status: PlanItemStatus.APPROVED })
      .andWhere('plan.status = :planStatus', { planStatus: ContentPlanStatus.ACTIVE })
      .andWhere("CONCAT(item.day, ' ', item.time_slot)::timestamp <= :now", { now })
      .getMany();

    for (const item of dueItems) {
      item.status = PlanItemStatus.PUBLISHED;
      await this.itemRepo.save(item);
      this.logger.log(`Published plan item ${item.id} from plan ${item.planId}`);
    }
  }
}
