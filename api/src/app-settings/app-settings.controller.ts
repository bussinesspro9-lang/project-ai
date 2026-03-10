import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AppSettingsService } from './app-settings.service';
import { UpdateAppSettingDto } from './dto/update-app-setting.dto';

@ApiTags('App Settings')
@ApiBearerAuth()
@Controller('settings/app')
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all app settings (admin only)' })
  @ApiResponse({ status: 200, description: 'All app settings returned' })
  async getAll() {
    return this.appSettingsService.getAll();
  }

  @Patch(':key')
  @ApiOperation({ summary: 'Update an app setting by key (admin only)' })
  @ApiResponse({ status: 200, description: 'Setting updated' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  async update(
    @Param('key') key: string,
    @Body() dto: UpdateAppSettingDto,
  ) {
    return this.appSettingsService.update(key, dto.value);
  }
}
