import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AchievementDefinition } from './entities/achievement-definition.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { RealtimeService } from '../realtime/realtime.service';
import { SEED_ACHIEVEMENTS } from '../database/seed-data';

@Injectable()
export class GamificationService implements OnModuleInit {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    @InjectRepository(AchievementDefinition)
    private readonly definitionRepo: Repository<AchievementDefinition>,
    @InjectRepository(UserAchievement)
    private readonly achievementRepo: Repository<UserAchievement>,
    private readonly realtimeService: RealtimeService,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const count = await this.definitionRepo.count();
    if (count === 0) {
      for (const a of SEED_ACHIEVEMENTS) {
        await this.definitionRepo.save(this.definitionRepo.create(a));
      }
      this.logger.log(`Seeded ${SEED_ACHIEVEMENTS.length} achievement definitions`);
    }
  }

  async getAllDefinitions(): Promise<AchievementDefinition[]> {
    return this.definitionRepo.find({ order: { badgeTier: 'ASC' } });
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return this.achievementRepo.find({
      where: { userId },
      relations: ['achievement'],
      order: { unlockedAt: 'DESC' },
    });
  }

  async checkAndUnlock(
    userId: number,
    slug: string,
    currentValue: number,
  ): Promise<UserAchievement | null> {
    const definition = await this.definitionRepo.findOne({ where: { slug } });
    if (!definition) return null;

    const existing = await this.achievementRepo.findOne({
      where: { userId, achievementId: definition.id, progress: definition.conditionValue },
    });
    if (existing) return null;

    if (currentValue >= definition.conditionValue) {
      const achievement = this.achievementRepo.create({
        userId,
        achievementId: definition.id,
        progress: definition.conditionValue,
      });
      const saved = await this.achievementRepo.save(achievement);

      this.realtimeService.achievementUnlocked(userId, definition.id, definition.title);

      return saved;
    }

    let partial = await this.achievementRepo.findOne({
      where: { userId, achievementId: definition.id },
    });
    if (!partial) {
      partial = this.achievementRepo.create({
        userId,
        achievementId: definition.id,
        progress: currentValue,
      });
    } else {
      partial.progress = currentValue;
    }
    return this.achievementRepo.save(partial);
  }
}
