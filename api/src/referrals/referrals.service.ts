import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from './entities/referral.entity';
import { ReferralStatus, ReferralRewardType } from '../common/enums';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectRepository(Referral)
    private readonly referralRepo: Repository<Referral>,
    private readonly appSettings: AppSettingsService,
  ) {}

  async getMyCode(userId: number): Promise<{ code: string; link: string }> {
    let referral = await this.referralRepo.findOne({
      where: { referrerId: userId, refereeId: null as any },
    });

    if (!referral) {
      const code = `BP-${userId}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const link = `https://businesspro.in/r/${code}`;

      referral = this.referralRepo.create({
        referrerId: userId,
        referralCode: code,
        referralLink: link,
        status: ReferralStatus.PENDING,
        rewardType: ReferralRewardType.FREE_DAYS,
        rewardValue: this.appSettings.getNumber('referral_reward_days') || 30,
      });
      await this.referralRepo.save(referral);
    }

    return { code: referral.referralCode, link: referral.referralLink };
  }

  async getStats(userId: number) {
    const total = await this.referralRepo.count({ where: { referrerId: userId } });
    const signedUp = await this.referralRepo.count({
      where: { referrerId: userId, status: ReferralStatus.SIGNED_UP },
    });
    const rewarded = await this.referralRepo.count({
      where: { referrerId: userId, status: ReferralStatus.REWARDED },
    });

    return { totalInvites: total, signedUp, rewarded };
  }

  async applyCode(refereeId: number, code: string): Promise<void> {
    const referral = await this.referralRepo.findOne({
      where: { referralCode: code },
    });

    if (!referral) throw new NotFoundException('Referral code not found');
    if (referral.referrerId === refereeId) {
      throw new BadRequestException('Cannot use your own referral code');
    }

    const existing = await this.referralRepo.findOne({
      where: { refereeId: refereeId },
    });
    if (existing) throw new BadRequestException('Referral already applied');

    const newReferral = this.referralRepo.create({
      referrerId: referral.referrerId,
      refereeId,
      referralCode: `${code}-${refereeId}`,
      referralLink: referral.referralLink,
      status: ReferralStatus.SIGNED_UP,
      rewardType: referral.rewardType,
      rewardValue: referral.rewardValue,
    });
    await this.referralRepo.save(newReferral);
  }
}
