import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { TemplateCategory, Region } from '../../common/enums';

export class QueryTemplatesDto extends PaginationDto {
  @ApiPropertyOptional({ enum: TemplateCategory })
  @IsEnum(TemplateCategory)
  @IsOptional()
  category?: TemplateCategory;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  businessType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiPropertyOptional({ enum: Region })
  @IsEnum(Region)
  @IsOptional()
  region?: Region;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tone?: string;
}
