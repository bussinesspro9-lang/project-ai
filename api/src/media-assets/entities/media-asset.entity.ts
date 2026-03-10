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
import { User } from '../../users/entities/user.entity';
import { AssetType, AssetCategory, CdnProvider } from '../../common/enums';

@Entity('media_assets')
export class MediaAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, generated: 'uuid' })
  uuid: string;

  @Column({ name: 'user_id', nullable: true })
  @Index()
  userId: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: AssetType, name: 'asset_type' })
  assetType: AssetType;

  @Column({ type: 'enum', enum: AssetCategory })
  category: AssetCategory;

  @Column({ type: 'varchar', nullable: true })
  subcategory: string;

  @Column({ type: 'text', name: 'cdn_url' })
  cdnUrl: string;

  @Column({ type: 'enum', enum: CdnProvider, name: 'cdn_provider', default: CdnProvider.CLOUDINARY })
  cdnProvider: CdnProvider;

  @Column({ type: 'varchar', nullable: true, name: 'provider_public_id' })
  providerPublicId: string;

  @Column({ type: 'varchar', nullable: true, name: 'original_filename' })
  originalFilename: string;

  @Column({ type: 'varchar', nullable: true, name: 'mime_type' })
  mimeType: string;

  @Column({ type: 'int', nullable: true, name: 'file_size_bytes' })
  fileSizeBytes: number;

  @Column({ type: 'int', nullable: true })
  width: number;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ type: 'float', nullable: true, name: 'duration_seconds' })
  durationSeconds: number;

  @Column({ type: 'varchar', nullable: true })
  format: string;

  @Column({ type: 'varchar', nullable: true, name: 'alt_text' })
  altText: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', array: true, default: '{}' })
  tags: string[];

  @Column({ type: 'varchar', nullable: true })
  platform: string;

  @Column({ type: 'varchar', nullable: true, name: 'related_entity_type' })
  relatedEntityType: string;

  @Column({ type: 'int', nullable: true, name: 'related_entity_id' })
  relatedEntityId: number;

  @Column({ default: false, name: 'is_system' })
  isSystem: boolean;

  @Column({ default: false, name: 'is_ai_generated' })
  isAiGenerated: boolean;

  @Column({ type: 'text', nullable: true, name: 'ai_generation_prompt' })
  aiGenerationPrompt: string;

  @Column({ type: 'varchar', nullable: true, name: 'ai_generation_model' })
  aiGenerationModel: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true, name: 'ai_generation_cost' })
  aiGenerationCost: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
