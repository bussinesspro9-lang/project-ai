import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import {
  AchievementCategory,
  AchievementConditionType,
  BadgeTier,
} from '../../common/enums';

@Entity('achievement_definitions')
export class AchievementDefinition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', nullable: true, name: 'icon_asset_id' })
  iconAssetId: number;

  @Column({ type: 'enum', enum: AchievementCategory })
  category: AchievementCategory;

  @Column({ type: 'enum', enum: AchievementConditionType, name: 'condition_type' })
  conditionType: AchievementConditionType;

  @Column({ type: 'int', name: 'condition_value' })
  conditionValue: number;

  @Column({ type: 'int', default: 10, name: 'xp_reward' })
  xpReward: number;

  @Column({ type: 'enum', enum: BadgeTier, name: 'badge_tier', default: BadgeTier.BRONZE })
  badgeTier: BadgeTier;

  @Column({ type: 'jsonb', nullable: true })
  translations: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
