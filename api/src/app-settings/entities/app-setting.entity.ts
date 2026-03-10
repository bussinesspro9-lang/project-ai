import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import {
  AppSettingValueType,
  AppSettingCategory,
} from '../../common/enums';

@Entity('app_settings')
export class AppSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({
    type: 'enum',
    enum: AppSettingValueType,
    name: 'value_type',
    default: AppSettingValueType.STRING,
  })
  valueType: AppSettingValueType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AppSettingCategory,
    default: AppSettingCategory.SYSTEM,
  })
  category: AppSettingCategory;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
