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
import { AchievementDefinition } from './achievement-definition.entity';

@Entity('user_achievements')
export class UserAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  @Index()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'achievement_id' })
  achievementId: number;

  @ManyToOne(() => AchievementDefinition, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'achievement_id' })
  achievement: AchievementDefinition;

  @CreateDateColumn({ name: 'unlocked_at' })
  unlockedAt: Date;

  @Column({ default: false })
  notified: boolean;

  @Column({ type: 'int', default: 0 })
  progress: number;
}
