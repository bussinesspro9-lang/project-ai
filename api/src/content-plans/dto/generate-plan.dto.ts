import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class GeneratePlanDto {
  @ApiProperty({ example: 'weekly', description: 'Plan type: weekly or monthly' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: '2025-03-10' })
  @IsDateString()
  @IsOptional()
  startDate?: string;
}

export class UpdatePlanItemDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  suggestedCaption?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  suggestedHashtags?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  platform?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  contentGoal?: string;
}
