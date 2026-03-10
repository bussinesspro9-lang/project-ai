import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { AssetType, AssetCategory } from '../../common/enums';

export class UploadMediaDto {
  @ApiProperty({ enum: AssetType })
  @IsEnum(AssetType)
  assetType: AssetType;

  @ApiProperty({ enum: AssetCategory })
  @IsEnum(AssetCategory)
  category: AssetCategory;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subcategory?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  altText?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  relatedEntityType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  relatedEntityId?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;
}
