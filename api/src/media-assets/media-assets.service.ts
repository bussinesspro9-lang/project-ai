import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { MediaAsset } from './entities/media-asset.entity';
import { Translation } from './entities/translation.entity';
import { UploadMediaDto } from './dto/upload-media.dto';
import { QueryMediaDto } from './dto/query-media.dto';
import { TranslationEntityType } from '../common/enums';
import { paginate } from '../common/dto/pagination.dto';

@Injectable()
export class MediaAssetsService {
  constructor(
    @InjectRepository(MediaAsset)
    private readonly mediaRepository: Repository<MediaAsset>,
    @InjectRepository(Translation)
    private readonly translationRepository: Repository<Translation>,
  ) {}

  async create(
    userId: number | null,
    cdnUrl: string,
    dto: UploadMediaDto,
    providerData?: { publicId?: string; filename?: string; mimeType?: string; size?: number; width?: number; height?: number; format?: string },
  ): Promise<MediaAsset> {
    const asset = this.mediaRepository.create({
      userId,
      cdnUrl,
      assetType: dto.assetType,
      category: dto.category,
      subcategory: dto.subcategory,
      altText: dto.altText,
      description: dto.description,
      tags: dto.tags || [],
      platform: dto.platform,
      relatedEntityType: dto.relatedEntityType,
      relatedEntityId: dto.relatedEntityId,
      isSystem: dto.isSystem || false,
      providerPublicId: providerData?.publicId,
      originalFilename: providerData?.filename,
      mimeType: providerData?.mimeType,
      fileSizeBytes: providerData?.size,
      width: providerData?.width,
      height: providerData?.height,
      format: providerData?.format,
    });

    return this.mediaRepository.save(asset);
  }

  async findAll(userId: number | null, query: QueryMediaDto) {
    const where: FindOptionsWhere<MediaAsset> = {};

    if (userId) where.userId = userId;
    if (query.assetType) where.assetType = query.assetType;
    if (query.category) where.category = query.category;
    if (query.relatedEntityType) where.relatedEntityType = query.relatedEntityType;
    if (query.relatedEntityId) where.relatedEntityId = query.relatedEntityId;

    if (query.search) {
      where.altText = ILike(`%${query.search}%`);
    }

    return paginate(this.mediaRepository, query, {
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<MediaAsset> {
    const asset = await this.mediaRepository.findOne({ where: { id } });
    if (!asset) throw new NotFoundException('Media asset not found');
    return asset;
  }

  async remove(id: number): Promise<void> {
    const asset = await this.findById(id);
    await this.mediaRepository.remove(asset);
  }

  async getStorageStats(userId: number) {
    const result = await this.mediaRepository
      .createQueryBuilder('m')
      .select('COUNT(*)', 'totalAssets')
      .addSelect('COALESCE(SUM(m.file_size_bytes), 0)', 'totalBytes')
      .where('m.user_id = :userId', { userId })
      .getRawOne();

    return {
      totalAssets: Number(result.totalAssets),
      totalBytes: Number(result.totalBytes),
    };
  }

  // --- Translation helpers ---

  async getTranslations(
    entityType: TranslationEntityType,
    entityId: number,
    language?: string,
  ): Promise<Translation[]> {
    const where: FindOptionsWhere<Translation> = { entityType, entityId };
    if (language) where.language = language;
    return this.translationRepository.find({ where });
  }

  async upsertTranslation(
    entityType: TranslationEntityType,
    entityId: number,
    language: string,
    fieldName: string,
    translatedText: string,
  ): Promise<Translation> {
    let existing = await this.translationRepository.findOne({
      where: { entityType, entityId, language, fieldName },
    });

    if (existing) {
      existing.translatedText = translatedText;
      return this.translationRepository.save(existing);
    }

    const translation = this.translationRepository.create({
      entityType,
      entityId,
      language,
      fieldName,
      translatedText,
    });
    return this.translationRepository.save(translation);
  }
}
