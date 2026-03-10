import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { InsightCategory, InsightTone } from '../../common/enums';

@Entity('insight_templates')
export class InsightTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: InsightCategory })
  category: InsightCategory;

  @Column({ type: 'text', name: 'template_text' })
  templateText: string;

  @Column({ type: 'enum', enum: InsightTone })
  tone: InsightTone;

  @Column({ type: 'text', nullable: true, name: 'trigger_condition' })
  triggerCondition: string;

  @Column({ type: 'text', array: true, default: '{}' })
  languages: string[];

  @Column({ type: 'int', default: 0 })
  priority: number;

  @Column({ type: 'int', default: 24, name: 'cooldown_hours' })
  cooldownHours: number;

  @Column({ default: false, name: 'is_notification_worthy' })
  isNotificationWorthy: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
