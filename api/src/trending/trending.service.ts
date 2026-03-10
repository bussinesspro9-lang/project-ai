import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, IsNull, Not } from 'typeorm';
import { TrendingTopic } from './entities/trending-topic.entity';

@Injectable()
export class TrendingService {
  constructor(
    @InjectRepository(TrendingTopic)
    private readonly trendingRepo: Repository<TrendingTopic>,
  ) {}

  async findActive(businessType?: string, limit = 10): Promise<TrendingTopic[]> {
    const now = new Date();
    const qb = this.trendingRepo
      .createQueryBuilder('t')
      .where('(t.expires_at IS NULL OR t.expires_at > :now)', { now })
      .orderBy('t.relevance_score', 'DESC')
      .take(limit);

    if (businessType) {
      qb.andWhere(':bt = ANY(t.business_types)', { bt: businessType });
    }

    return qb.getMany();
  }

  async addTopic(data: Partial<TrendingTopic>): Promise<TrendingTopic> {
    const topic = this.trendingRepo.create({
      ...data,
      trendingSince: data.trendingSince || new Date(),
    });
    return this.trendingRepo.save(topic);
  }
}
