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
import { PreferenceSignalType } from '../../common/enums';

@Entity('user_preference_signals')
export class UserPreferenceSignal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  @Index()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: PreferenceSignalType, name: 'signal_type' })
  @Index()
  signalType: PreferenceSignalType;

  @Column({ type: 'text', name: 'signal_value' })
  signalValue: string;

  @Column({ type: 'jsonb', nullable: true })
  context: Record<string, any>;

  @Column({ type: 'varchar', nullable: true, name: 'source_entity_type' })
  sourceEntityType: string;

  @Column({ type: 'int', nullable: true, name: 'source_entity_id' })
  sourceEntityId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
