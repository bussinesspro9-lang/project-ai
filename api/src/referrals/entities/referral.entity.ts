import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReferralStatus, ReferralRewardType } from '../../common/enums';

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'referrer_id' })
  @Index()
  referrerId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'referrer_id' })
  referrer: User;

  @Column({ name: 'referee_id', nullable: true })
  refereeId: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'referee_id' })
  referee: User;

  @Column({ type: 'varchar', unique: true, name: 'referral_code' })
  referralCode: string;

  @Column({ type: 'varchar', name: 'referral_link' })
  referralLink: string;

  @Column({ type: 'varchar', nullable: true })
  channel: string;

  @Column({ type: 'enum', enum: ReferralStatus, default: ReferralStatus.PENDING })
  status: ReferralStatus;

  @Column({ type: 'enum', enum: ReferralRewardType, default: ReferralRewardType.FREE_DAYS, name: 'reward_type' })
  rewardType: ReferralRewardType;

  @Column({ type: 'int', default: 30, name: 'reward_value' })
  rewardValue: number;

  @Column({ type: 'timestamp', nullable: true, name: 'reward_given_at' })
  rewardGivenAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
