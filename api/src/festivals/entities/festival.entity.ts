import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FestivalType } from '../../common/enums';

@Entity('festivals')
export class Festival {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'date', name: 'date_start' })
  dateStart: Date;

  @Column({ type: 'date', nullable: true, name: 'date_end' })
  dateEnd: Date;

  @Column({ type: 'enum', enum: FestivalType })
  type: FestivalType;

  @Column({ type: 'text', array: true, default: '{}' })
  regions: string[];

  @Column({ type: 'text', array: true, default: '{}', name: 'relevant_business_types' })
  relevantBusinessTypes: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  themes: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  keywords: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  colors: string[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  significance: string;

  @Column({ type: 'int', nullable: true, name: 'banner_asset_id' })
  bannerAssetId: number;

  @Column({ type: 'varchar', nullable: true, name: 'recurring_rule' })
  recurringRule: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
