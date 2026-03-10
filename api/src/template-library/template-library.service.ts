import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './entities/template.entity';
import { UserTemplateHistory } from './entities/user-template-history.entity';
import { QueryTemplatesDto } from './dto/query-templates.dto';
import { SEED_TEMPLATES } from '../database/seed-data';

@Injectable()
export class TemplateLibraryService implements OnModuleInit {
  private readonly logger = new Logger(TemplateLibraryService.name);

  constructor(
    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>,
    @InjectRepository(UserTemplateHistory)
    private readonly historyRepo: Repository<UserTemplateHistory>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    for (const t of SEED_TEMPLATES) {
      const exists = await this.templateRepo.findOne({ where: { slug: t.slug } });
      if (!exists) {
        await this.templateRepo.save(this.templateRepo.create(t));
        this.logger.log(`Seeded template: ${t.slug}`);
      }
    }
  }

  async findAll(query: QueryTemplatesDto) {
    const qb = this.templateRepo.createQueryBuilder('t');

    if (query.category) qb.andWhere('t.category = :category', { category: query.category });
    if (query.region) qb.andWhere('t.region = :region', { region: query.region });
    if (query.tone) qb.andWhere('t.tone = :tone', { tone: query.tone });
    if (query.businessType) qb.andWhere(':bt = ANY(t.business_types)', { bt: query.businessType });
    if (query.language) qb.andWhere(':lang = ANY(t.languages)', { lang: query.language });
    if (query.platform) qb.andWhere(':platform = ANY(t.platforms)', { platform: query.platform });
    if (query.search) {
      qb.andWhere('(t.title ILIKE :s OR t.slug ILIKE :s OR :s = ANY(t.keywords))', { s: `%${query.search}%` });
    }

    qb.orderBy('t.effectiveness_score', 'DESC').addOrderBy('t.usage_count', 'DESC');

    const page = query.page || 1;
    const limit = query.limit || 20;
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findFeatured() {
    return this.templateRepo.find({
      where: { isFeatured: true },
      order: { effectivenessScore: 'DESC' },
      take: 10,
    });
  }

  async findById(id: number): Promise<Template> {
    const template = await this.templateRepo.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');
    return template;
  }

  async recordUsage(userId: number, templateId: number, customizedContent?: string) {
    const template = await this.findById(templateId);
    template.usageCount += 1;
    await this.templateRepo.save(template);

    const history = this.historyRepo.create({
      userId,
      templateId,
      customizedContent,
    });
    return this.historyRepo.save(history);
  }
}
