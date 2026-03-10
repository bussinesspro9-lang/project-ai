import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Festival } from './entities/festival.entity';
import { SEED_FESTIVALS } from '../database/seed-data';

@Injectable()
export class FestivalsService implements OnModuleInit {
  private readonly logger = new Logger(FestivalsService.name);

  constructor(
    @InjectRepository(Festival)
    private readonly festivalRepo: Repository<Festival>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    for (const f of SEED_FESTIVALS) {
      const exists = await this.festivalRepo.findOne({ where: { slug: f.slug } });
      if (!exists) {
        await this.festivalRepo.save(this.festivalRepo.create(f));
      }
    }
    this.logger.log(`Seeded ${SEED_FESTIVALS.length} festivals`);
  }

  async findUpcoming(limit = 5): Promise<Festival[]> {
    const now = new Date();
    return this.festivalRepo.find({
      where: { isActive: true, dateStart: MoreThanOrEqual(now) },
      order: { dateStart: 'ASC' },
      take: limit,
    });
  }

  async findAll(): Promise<Festival[]> {
    return this.festivalRepo.find({ where: { isActive: true }, order: { dateStart: 'ASC' } });
  }

  async findById(id: number): Promise<Festival> {
    const festival = await this.festivalRepo.findOne({ where: { id } });
    if (!festival) throw new NotFoundException('Festival not found');
    return festival;
  }

  async findBySlug(slug: string): Promise<Festival> {
    const festival = await this.festivalRepo.findOne({ where: { slug } });
    if (!festival) throw new NotFoundException('Festival not found');
    return festival;
  }
}
