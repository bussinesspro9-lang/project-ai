import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateAppSettingDto {
  @ApiProperty({ example: 'true', description: 'New value for the setting (always a string, parsed by value_type)' })
  @IsString()
  @IsNotEmpty()
  value: string;
}
