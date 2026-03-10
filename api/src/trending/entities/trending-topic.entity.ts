import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('trending_topics')
export class TrendingTopic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  topic: string;

  @Column({ type: 'text', array: true, default: '{}' })
  hashtags: string[];

  @Column({ type: 'varchar' })
  source: string;

  @Column({ type: 'float', default: 0, name: 'relevance_score' })
  relevanceScore: number;

  @Column({ type: 'text', array: true, default: '{}', name: 'business_types' })
  businessTypes: string[];

  @Column({ type: 'varchar', nullable: true })
  region: string;

  @Column({ type: 'varchar', nullable: true })
  language: string;

  @Column({ type: 'timestamp', name: 'trending_since' })
  trendingSince: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'text', nullable: true, name: 'content_suggestion' })
  contentSuggestion: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
