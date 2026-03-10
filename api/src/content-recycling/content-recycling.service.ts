import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThan, LessThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Content } from '../content/entities/content.entity';
import { ContentStatus } from '../common/enums';
import { RealtimeService } from '../realtime/realtime.service';

@Injectable()
export class ContentRecyclingService {
  private readonly logger = new Logger(ContentRecyclingService.name);

  constructor(
    @InjectRepository(Content)
    private readonly contentRepo: Repository<Content>,
    private readonly realtimeService: RealtimeService,
  ) {}

  @Cron('0 0 * * 1')
  async detectTopPerformers(): Promise<void> {
    this.logger.log('Running content recycling cron...');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const candidates = await this.contentRepo
      .createQueryBuilder('c')
      .where('c.status = :status', { status: ContentStatus.PUBLISHED })
      .andWhere('c.published_at < :threshold', { threshold: thirtyDaysAgo })
      .andWhere('c.recycled_from_id IS NULL')
      .orderBy("(c.engagement->>'likes')::int + (c.engagement->>'comments')::int + (c.engagement->>'shares')::int", 'DESC')
      .take(10)
      .getMany();

    this.logger.log(`Found ${candidates.length} recyclable content pieces`);

    for (const content of candidates) {
      const alreadyRecycled = await this.contentRepo.findOne({
        where: { recycledFromId: content.id },
      });
      if (alreadyRecycled) continue;

      this.realtimeService.emit(content.userId, 'content.recycle_suggestion', {
        contentId: content.id,
        caption: content.caption,
        platform: content.platform,
      });
    }
  }

  async getRecycleSuggestions(userId: number) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.contentRepo
      .createQueryBuilder('c')
      .where('c.user_id = :userId', { userId })
      .andWhere('c.status = :status', { status: ContentStatus.PUBLISHED })
      .andWhere('c.published_at < :threshold', { threshold: thirtyDaysAgo })
      .andWhere('c.recycled_from_id IS NULL')
      .orderBy("(c.engagement->>'likes')::int + (c.engagement->>'comments')::int", 'DESC')
      .take(5)
      .getMany();
  }
}
