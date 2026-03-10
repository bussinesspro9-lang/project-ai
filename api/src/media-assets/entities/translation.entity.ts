import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
} from 'typeorm';
import { TranslationEntityType } from '../../common/enums';

@Entity('translations')
@Unique(['entityType', 'entityId', 'language', 'fieldName'])
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TranslationEntityType, name: 'entity_type' })
  @Index()
  entityType: TranslationEntityType;

  @Column({ type: 'int', name: 'entity_id' })
  @Index()
  entityId: number;

  @Column({ type: 'varchar', length: 10 })
  language: string;

  @Column({ type: 'varchar', name: 'field_name' })
  fieldName: string;

  @Column({ type: 'text', name: 'translated_text' })
  translatedText: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
