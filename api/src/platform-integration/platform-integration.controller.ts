import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PlatformIntegrationService } from './platform-integration.service';

@ApiTags('Platform Integration')
@ApiBearerAuth()
@Controller('platform-integration')
export class PlatformIntegrationController {
  constructor(private readonly service: PlatformIntegrationService) {}

  @Get()
  @ApiOperation({ summary: 'List connected platforms for current user' })
  @ApiResponse({ status: 200, description: 'Connected platforms returned' })
  async findAll(@CurrentUser('id') userId: number) {
    return this.service.findByUser(userId);
  }

  @Post('connect')
  @ApiOperation({ summary: 'Connect a social media platform' })
  @ApiResponse({ status: 201, description: 'Platform connected' })
  async connect(
    @CurrentUser('id') userId: number,
    @Body() body: { platform: string; accessToken: string; refreshToken?: string; platformUserId?: string; platformPageId?: string; scopes?: string[]; metadata?: Record<string, any> },
  ) {
    return this.service.connect(userId, body.platform, body);
  }

  @Delete(':platform')
  @ApiOperation({ summary: 'Disconnect a platform' })
  @ApiResponse({ status: 200, description: 'Platform disconnected' })
  async disconnect(
    @CurrentUser('id') userId: number,
    @Param('platform') platform: string,
  ) {
    await this.service.disconnect(userId, platform);
    return { message: 'Platform disconnected' };
  }
}
