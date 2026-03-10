import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Region, CaptionLength, EmojiDensity } from '../../common/enums';

@Entity('user_preferences')
export class UserPreferences {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  @Index()
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // --- Regional ---
  @Column({ type: 'enum', enum: Region, nullable: true })
  region: Region;

  @Column({ type: 'varchar', nullable: true })
  state: string;

  @Column({ type: 'varchar', nullable: true })
  city: string;

  @Column({ type: 'varchar', nullable: true, name: 'primary_language' })
  primaryLanguage: string;

  @Column({ type: 'text', array: true, default: '{}', name: 'secondary_languages' })
  secondaryLanguages: string[];

  @Column({ type: 'text', array: true, default: '{}', name: 'cultural_themes' })
  culturalThemes: string[];

  @Column({ type: 'text', array: true, default: '{}', name: 'local_keywords' })
  localKeywords: string[];

  @Column({ type: 'varchar', nullable: true, name: 'preferred_content_style' })
  preferredContentStyle: string;

  @Column({ type: 'text', array: true, default: '{}', name: 'local_festivals' })
  localFestivals: string[];

  // --- AI-Learned ---
  @Column({ type: 'varchar', nullable: true, name: 'preferred_tone' })
  preferredTone: string;

  @Column({ type: 'text', array: true, default: '{}', name: 'preferred_languages' })
  preferredLanguages: string[];

  @Column({ type: 'text', array: true, default: '{}', name: 'preferred_platforms' })
  preferredPlatforms: string[];

  @Column({ type: 'text', array: true, default: '{}', name: 'preferred_categories' })
  preferredCategories: string[];

  @Column({ type: 'enum', enum: CaptionLength, nullable: true, name: 'preferred_caption_length' })
  preferredCaptionLength: CaptionLength;

  @Column({ type: 'int', nullable: true, name: 'preferred_hashtag_count' })
  preferredHashtagCount: number;

  @Column({ type: 'text', array: true, default: '{}', name: 'custom_hashtags' })
  customHashtags: string[];

  @Column({ type: 'jsonb', nullable: true, name: 'preferred_posting_times' })
  preferredPostingTimes: Record<string, any>;

  @Column({ type: 'varchar', nullable: true, name: 'preferred_visual_style' })
  preferredVisualStyle: string;

  @Column({ type: 'varchar', nullable: true, name: 'preferred_cta_style' })
  preferredCtaStyle: string;

  @Column({ type: 'enum', enum: EmojiDensity, nullable: true, name: 'emoji_density' })
  emojiDensity: EmojiDensity;

  @Column({ type: 'float', nullable: true, name: 'content_satisfaction_score' })
  contentSatisfactionScore: number;

  @Column({ type: 'jsonb', nullable: true, name: 'confidence_scores' })
  confidenceScores: Record<string, number>;

  @Column({ type: 'timestamp', nullable: true, name: 'preferences_last_computed_at' })
  preferencesLastComputedAt: Date;

  @Column({ type: 'int', default: 0, name: 'signal_count' })
  signalCount: number;

  // --- Engagement Rules ---
  @Column({ type: 'jsonb', nullable: true, name: 'engagement_rules' })
  engagementRules: any[];

  // --- Gamification Streaks ---
  @Column({ type: 'int', default: 0, name: 'current_streak' })
  currentStreak: number;

  @Column({ type: 'int', default: 0, name: 'longest_streak' })
  longestStreak: number;

  @Column({ type: 'date', nullable: true, name: 'last_post_date' })
  lastPostDate: Date;

  @Column({ type: 'int', default: 7, name: 'weekly_goal' })
  weeklyGoal: number;

  @Column({ type: 'int', default: 0, name: 'weekly_progress' })
  weeklyProgress: number;

  // --- Toggle ---
  @Column({ default: true, name: 'personalization_enabled' })
  personalizationEnabled: boolean;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
