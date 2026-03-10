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
import { InsightTemplate } from './insight-template.entity';

@Entity('user_insights')
export class UserInsight {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  @Index()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'insight_template_id' })
  insightTemplateId: number;

  @ManyToOne(() => InsightTemplate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'insight_template_id' })
  insightTemplate: InsightTemplate;

  @Column({ type: 'text', name: 'rendered_text' })
  renderedText: string;

  @Column({ type: 'jsonb', nullable: true, name: 'data_snapshot' })
  dataSnapshot: Record<string, any>;

  @CreateDateColumn({ name: 'shown_at' })
  shownAt: Date;

  @Column({ default: false })
  clicked: boolean;

  @Column({ default: false })
  dismissed: boolean;

  @Column({ default: false, name: 'sent_as_notification' })
  sentAsNotification: boolean;
}
