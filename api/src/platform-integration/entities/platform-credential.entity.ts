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

@Entity('platform_credentials')
export class PlatformCredential {
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

  @Column({ type: 'text', nullable: true, name: 'access_token' })
  accessToken: string;

  @Column({ type: 'text', nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @Column({ type: 'timestamp', nullable: true, name: 'token_expires_at' })
  tokenExpiresAt: Date;

  @Column({ type: 'varchar', nullable: true, name: 'platform_user_id' })
  platformUserId: string;

  @Column({ type: 'varchar', nullable: true, name: 'platform_page_id' })
  platformPageId: string;

  @Column({ type: 'text', array: true, default: '{}' })
  scopes: string[];

  @Column({ default: false, name: 'is_connected' })
  isConnected: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'last_synced_at' })
  lastSyncedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
