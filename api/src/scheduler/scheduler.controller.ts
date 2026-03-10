import { Controller, Post, Get, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModelSyncScheduler } from './schedulers/model-sync.scheduler';
import { ModelSyncService } from './services/model-sync.service';

@ApiTags('scheduler')
@Controller('scheduler')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SchedulerController {
  constructor(
    private readonly modelSyncScheduler: ModelSyncScheduler,
    private readonly modelSyncService: ModelSyncService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sync-models')
  @ApiOperation({ summary: 'Manually trigger AI models synchronization (requires auth)' })
  @ApiResponse({
    status: 200,
    description: 'Models synchronization triggered successfully',
  })
  async triggerModelSync() {
    return this.modelSyncScheduler.triggerManualSync();
  }

  @Get('sync-stats')
  @ApiOperation({ summary: 'Get AI models sync statistics (requires auth)' })
  @ApiResponse({
    status: 200,
    description: 'Returns sync statistics',
  })
  async getSyncStats() {
    return this.modelSyncService.getSyncStats();
  }
}
