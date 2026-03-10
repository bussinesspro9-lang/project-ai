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
import {
  InteractionType,
  InteractionDirection,
  ResponseStatus,
} from '../../common/enums';

@Entity('engagement_interactions')
export class EngagementInteraction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  @Index()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar' })
  platform: string;

  @Column({ type: 'enum', enum: InteractionType, name: 'interaction_type' })
  @Index()
  interactionType: InteractionType;

  @Column({ type: 'enum', enum: InteractionDirection })
  direction: InteractionDirection;

  @Column({ type: 'varchar', nullable: true, name: 'external_id' })
  externalId: string;

  @Column({ type: 'varchar', nullable: true, name: 'author_name' })
  authorName: string;

  @Column({ type: 'varchar', nullable: true, name: 'author_profile_url' })
  authorProfileUrl: string;

  @Column({ type: 'text', nullable: true, name: 'original_content' })
  originalContent: string;

  @Column({ type: 'varchar', nullable: true })
  sentiment: string;

  @Column({ type: 'text', nullable: true, name: 'ai_response' })
  aiResponse: string;

  @Column({ type: 'text', nullable: true, name: 'final_response' })
  finalResponse: string;

  @Column({
    type: 'enum',
    enum: ResponseStatus,
    default: ResponseStatus.PENDING,
    name: 'response_status',
  })
  responseStatus: ResponseStatus;

  @Column({ type: 'timestamp', nullable: true, name: 'responded_at' })
  respondedAt: Date;

  @Column({ type: 'int', nullable: true, name: 'related_content_id' })
  relatedContentId: number;

  @Column({ type: 'float', nullable: true, name: 'relevance_score' })
  relevanceScore: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
