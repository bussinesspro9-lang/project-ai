import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PersonalizationService } from './personalization.service';

@ApiTags('Personalization')
@ApiBearerAuth()
@Controller('personalization')
export class PersonalizationController {
  constructor(private readonly service: PersonalizationService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get full user preferences (regional + learned + rules + streaks)' })
  @ApiResponse({ status: 200, description: 'Preferences returned' })
  async getProfile(@CurrentUser('id') userId: number) {
    return this.service.getProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update regional or manually override a learned preference' })
  @ApiResponse({ status: 200, description: 'Preferences updated' })
  async updateProfile(
    @CurrentUser('id') userId: number,
    @Body() updates: Record<string, any>,
  ) {
    return this.service.updateProfile(userId, updates);
  }

  @Delete('profile/:key')
  @ApiOperation({ summary: 'Reset a specific learned preference' })
  @ApiResponse({ status: 200, description: 'Preference reset' })
  async resetPreference(
    @CurrentUser('id') userId: number,
    @Param('key') key: string,
  ) {
    return this.service.resetPreference(userId, key);
  }

  @Patch('toggle')
  @ApiOperation({ summary: 'Enable/disable personalized mode' })
  @ApiResponse({ status: 200, description: 'Toggle updated' })
  async toggle(
    @CurrentUser('id') userId: number,
    @Body('enabled') enabled: boolean,
  ) {
    return this.service.togglePersonalization(userId, enabled);
  }

  @Get('signals/stats')
  @ApiOperation({ summary: 'Get signal count breakdown by type' })
  @ApiResponse({ status: 200, description: 'Signal stats returned' })
  async signalStats(@CurrentUser('id') userId: number) {
    return this.service.getSignalStats(userId);
  }
}
