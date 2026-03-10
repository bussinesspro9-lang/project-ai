import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ContentPlanStatus } from '../../common/enums';
import { ContentPlanItem } from './content-plan-item.entity';

@Entity('content_plans')
export class ContentPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  @Index()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', default: 'weekly' })
  type: string;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ContentPlanStatus,
    default: ContentPlanStatus.DRAFT,
  })
  status: ContentPlanStatus;

  @Column({ type: 'jsonb', nullable: true, name: 'generation_params' })
  generationParams: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'approved_at' })
  approvedAt: Date;

  @OneToMany(() => ContentPlanItem, (item) => item.plan, { cascade: true })
  items: ContentPlanItem[];
}
