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
import { Template } from './template.entity';

@Entity('user_template_history')
export class UserTemplateHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  @Index()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'template_id' })
  @Index()
  templateId: number;

  @ManyToOne(() => Template, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @CreateDateColumn({ name: 'used_at' })
  usedAt: Date;

  @Column({ type: 'text', nullable: true, name: 'customized_content' })
  customizedContent: string;

  @Column({ type: 'float', nullable: true, name: 'performance_score' })
  performanceScore: number;
}
