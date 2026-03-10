import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppSetting } from './entities/app-setting.entity';
import { SEED_APP_SETTINGS } from '../database/seed-data';

@Injectable()
export class AppSettingsService implements OnModuleInit {
  private readonly logger = new Logger(AppSettingsService.name);
  private cache = new Map<string, AppSetting>();

  constructor(
    @InjectRepository(AppSetting)
    private readonly settingsRepository: Repository<AppSetting>,
  ) {}

  async onModuleInit() {
    await this.seed();
    await this.refreshCache();
  }

  private async seed() {
    for (const entry of SEED_APP_SETTINGS) {
      const exists = await this.settingsRepository.findOne({
        where: { key: entry.key },
      });
      if (!exists) {
        await this.settingsRepository.save(
          this.settingsRepository.create(entry),
        );
        this.logger.log(`Seeded app_setting: ${entry.key} = ${entry.value}`);
      }
    }
  }

  private async refreshCache() {
    const all = await this.settingsRepository.find();
    this.cache.clear();
    for (const setting of all) {
      this.cache.set(setting.key, setting);
    }
  }

  async getAll(): Promise<AppSetting[]> {
    return Array.from(this.cache.values());
  }

  async get(key: string): Promise<string | null> {
    const cached = this.cache.get(key);
    if (cached) return cached.value;

    const setting = await this.settingsRepository.findOne({ where: { key } });
    if (!setting) return null;

    this.cache.set(key, setting);
    return setting.value;
  }

  getBoolean(key: string): boolean {
    const cached = this.cache.get(key);
    return cached?.value === 'true';
  }

  getNumber(key: string): number {
    const cached = this.cache.get(key);
    return cached ? Number(cached.value) : 0;
  }

  async update(key: string, value: string): Promise<AppSetting> {
    const setting = await this.settingsRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting '${key}' not found`);
    }

    setting.value = value;
    const saved = await this.settingsRepository.save(setting);
    this.cache.set(key, saved);
    return saved;
  }
}
