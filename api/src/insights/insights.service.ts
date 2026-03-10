import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsightTemplate } from './entities/insight-template.entity';
import { UserInsight } from './entities/user-insight.entity';
import { SEED_INSIGHTS } from '../database/seed-data';

@Injectable()
export class InsightsService implements OnModuleInit {
  private readonly logger = new Logger(InsightsService.name);

  constructor(
    @InjectRepository(InsightTemplate)
    private readonly templateRepo: Repository<InsightTemplate>,
    @InjectRepository(UserInsight)
    private readonly insightRepo: Repository<UserInsight>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const count = await this.templateRepo.count();
    if (count === 0) {
      for (const t of SEED_INSIGHTS) {
        await this.templateRepo.save(this.templateRepo.create(t));
      }
      this.logger.log(`Seeded ${SEED_INSIGHTS.length} insight templates`);
    }
  }

  async getAllTemplates(): Promise<InsightTemplate[]> {
    return this.templateRepo.find({ order: { priority: 'DESC' } });
  }

  async getUserInsights(userId: number, limit = 5): Promise<UserInsight[]> {
    return this.insightRepo.find({
      where: { userId },
      order: { shownAt: 'DESC' },
      take: limit,
      relations: ['insightTemplate'],
    });
  }

  async createInsight(
    userId: number,
    templateId: number,
    renderedText: string,
    dataSnapshot?: Record<string, any>,
  ): Promise<UserInsight> {
    const insight = this.insightRepo.create({
      userId,
      insightTemplateId: templateId,
      renderedText,
      dataSnapshot,
    });
    return this.insightRepo.save(insight);
  }

  async markClicked(id: number): Promise<void> {
    await this.insightRepo.update(id, { clicked: true });
  }

  async markDismissed(id: number): Promise<void> {
    await this.insightRepo.update(id, { dismissed: true });
  }
}
