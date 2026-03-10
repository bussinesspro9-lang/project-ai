import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { TemplateCategory, Region } from '../../common/enums';

@Entity('template_library')
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'enum', enum: TemplateCategory })
  @Index()
  category: TemplateCategory;

  @Column({ type: 'varchar', nullable: true })
  subcategory: string;

  @Column({ type: 'text', name: 'content_skeleton' })
  contentSkeleton: string;

  @Column({ type: 'text', nullable: true, name: 'hashtag_template' })
  hashtagTemplate: string;

  @Column({ type: 'text', nullable: true, name: 'cta_template' })
  ctaTemplate: string;

  @Column({ type: 'text', array: true, default: '{}' })
  platforms: string[];

  @Column({ type: 'text', array: true, default: '{}', name: 'business_types' })
  businessTypes: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  languages: string[];

  @Column({ type: 'varchar', nullable: true })
  tone: string;

  @Column({ type: 'varchar', nullable: true, name: 'visual_style' })
  visualStyle: string;

  @Column({ type: 'enum', enum: Region, default: Region.PAN_INDIA })
  region: Region;

  @Column({ type: 'int', default: 0, name: 'usage_count' })
  usageCount: number;

  @Column({ type: 'float', default: 0, name: 'effectiveness_score' })
  effectivenessScore: number;

  @Column({ default: false, name: 'is_featured' })
  isFeatured: boolean;

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  keywords: string[];

  @Column({ type: 'int', nullable: true, name: 'festival_id' })
  festivalId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
