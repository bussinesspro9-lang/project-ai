import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AssetType, AssetCategory } from '../../common/enums';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class QueryMediaDto extends PaginationDto {
  @ApiPropertyOptional({ enum: AssetType })
  @IsEnum(AssetType)
  @IsOptional()
  assetType?: AssetType;

  @ApiPropertyOptional({ enum: AssetCategory })
  @IsEnum(AssetCategory)
  @IsOptional()
  category?: AssetCategory;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  relatedEntityType?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  relatedEntityId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}
