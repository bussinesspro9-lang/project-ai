import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { UserPreferences } from './entities/user-preferences.entity';
import { UserPreferenceSignal } from './entities/user-preference-signal.entity';
import { PreferenceSignalType } from '../common/enums';

@Injectable()
export class PersonalizationService {
  private readonly logger = new Logger(PersonalizationService.name);

  constructor(
    @InjectRepository(UserPreferences)
    private readonly prefsRepo: Repository<UserPreferences>,
    @InjectRepository(UserPreferenceSignal)
    private readonly signalRepo: Repository<UserPreferenceSignal>,
  ) {}

  async getOrCreate(userId: number): Promise<UserPreferences> {
    let prefs = await this.prefsRepo.findOne({ where: { userId } });
    if (!prefs) {
      prefs = this.prefsRepo.create({ userId });
      prefs = await this.prefsRepo.save(prefs);
    }
    return prefs;
  }

  async getProfile(userId: number): Promise<UserPreferences> {
    return this.getOrCreate(userId);
  }

  async updateProfile(
    userId: number,
    updates: Partial<UserPreferences>,
  ): Promise<UserPreferences> {
    const prefs = await this.getOrCreate(userId);
    Object.assign(prefs, updates);
    return this.prefsRepo.save(prefs);
  }

  async resetPreference(userId: number, key: string): Promise<UserPreferences> {
    const prefs = await this.getOrCreate(userId);
    if (key in prefs) {
      (prefs as any)[key] = null;
    }
    return this.prefsRepo.save(prefs);
  }

  async togglePersonalization(userId: number, enabled: boolean): Promise<UserPreferences> {
    const prefs = await this.getOrCreate(userId);
    prefs.personalizationEnabled = enabled;
    return this.prefsRepo.save(prefs);
  }

  async recordSignal(
    userId: number,
    signalType: PreferenceSignalType,
    signalValue: string,
    context?: Record<string, any>,
    sourceEntityType?: string,
    sourceEntityId?: number,
  ): Promise<void> {
    const prefs = await this.getOrCreate(userId);
    if (!prefs.personalizationEnabled) return;

    const signal = this.signalRepo.create({
      userId,
      signalType,
      signalValue,
      context,
      sourceEntityType,
      sourceEntityId,
    });
    await this.signalRepo.save(signal);

    await this.prefsRepo.increment({ userId }, 'signalCount', 1);
  }

  async getSignalStats(userId: number) {
    const results = await this.signalRepo
      .createQueryBuilder('s')
      .select('s.signal_type', 'signalType')
      .addSelect('COUNT(*)', 'count')
      .where('s.user_id = :userId', { userId })
      .groupBy('s.signal_type')
      .getRawMany();

    return results.reduce((acc: Record<string, number>, row: any) => {
      acc[row.signalType] = Number(row.count);
      return acc;
    }, {});
  }

  @Cron('0 */6 * * *')
  async computePreferences(): Promise<void> {
    this.logger.log('Running preference computation cron...');

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const userIds = await this.signalRepo
      .createQueryBuilder('s')
      .select('DISTINCT s.user_id', 'userId')
      .where('s.created_at > :since', { since: ninetyDaysAgo })
      .getRawMany();

    for (const { userId } of userIds) {
      await this.computeForUser(Number(userId), ninetyDaysAgo);
    }

    this.logger.log(`Computed preferences for ${userIds.length} users`);
  }

  private async computeForUser(userId: number, since: Date): Promise<void> {
    const prefs = await this.getOrCreate(userId);
    if (!prefs.personalizationEnabled) return;

    const signals = await this.signalRepo.find({
      where: { userId, createdAt: MoreThan(since) },
      order: { createdAt: 'DESC' },
    });

    if (signals.length < 5) return;

    const confidence: Record<string, number> = {};

    const toneSignals = signals.filter((s) => s.signalType === PreferenceSignalType.TONE_OVERRIDE);
    if (toneSignals.length >= 3) {
      const counts = this.countValues(toneSignals);
      const top = this.topValue(counts);
      prefs.preferredTone = top.value;
      confidence.tone = top.confidence;
    }

    const langSignals = signals.filter((s) => s.signalType === PreferenceSignalType.LANGUAGE_CHOICE);
    if (langSignals.length >= 3) {
      const counts = this.countValues(langSignals);
      prefs.preferredLanguages = Object.keys(counts).sort(
        (a, b) => counts[b] - counts[a],
      );
      confidence.language = this.topValue(counts).confidence;
    }

    const platformSignals = signals.filter((s) => s.signalType === PreferenceSignalType.PLATFORM_AFFINITY);
    if (platformSignals.length >= 3) {
      const counts = this.countValues(platformSignals);
      prefs.preferredPlatforms = Object.keys(counts).sort(
        (a, b) => counts[b] - counts[a],
      );
      confidence.platform = this.topValue(counts).confidence;
    }

    const captionSignals = signals.filter((s) => s.signalType === PreferenceSignalType.CAPTION_LENGTH);
    if (captionSignals.length >= 3) {
      const counts = this.countValues(captionSignals);
      const top = this.topValue(counts);
      prefs.preferredCaptionLength = top.value as any;
      confidence.caption_length = top.confidence;
    }

    prefs.confidenceScores = confidence;
    prefs.preferencesLastComputedAt = new Date();
    await this.prefsRepo.save(prefs);
  }

  private countValues(signals: UserPreferenceSignal[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const s of signals) {
      counts[s.signalValue] = (counts[s.signalValue] || 0) + 1;
    }
    return counts;
  }

  private topValue(counts: Record<string, number>): { value: string; confidence: number } {
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, [, c]) => sum + c, 0);
    return {
      value: entries[0][0],
      confidence: Math.round((entries[0][1] / total) * 100) / 100,
    };
  }
}
