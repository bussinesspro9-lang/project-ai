import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ContentPlan } from './content-plan.entity';
import { PlanItemStatus } from '../../common/enums';

@Entity('content_plan_items')
export class ContentPlanItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'plan_id' })
  @Index()
  planId: number;

  @ManyToOne(() => ContentPlan, (plan) => plan.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan: ContentPlan;

  @Column({ type: 'int', nullable: true, name: 'content_id' })
  contentId: number;

  @Column({ type: 'date' })
  day: Date;

  @Column({ type: 'varchar', nullable: true, name: 'time_slot' })
  timeSlot: string;

  @Column({ type: 'varchar' })
  platform: string;

  @Column({ type: 'varchar', nullable: true, name: 'content_goal' })
  contentGoal: string;

  @Column({ type: 'int', nullable: true, name: 'template_id' })
  templateId: number;

  @Column({ type: 'text', nullable: true, name: 'suggested_caption' })
  suggestedCaption: string;

  @Column({ type: 'text', nullable: true, name: 'suggested_hashtags' })
  suggestedHashtags: string;

  @Column({
    type: 'enum',
    enum: PlanItemStatus,
    default: PlanItemStatus.SUGGESTED,
  })
  status: PlanItemStatus;

  @Column({ type: 'int', default: 0 })
  order: number;
}
