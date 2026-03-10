import { Controller, Get, Patch, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { InsightsService } from './insights.service';

@ApiTags('Insights')
@ApiBearerAuth()
@Controller('insights')
export class InsightsController {
  constructor(private readonly service: InsightsService) {}

  @Get('templates')
  @ApiOperation({ summary: 'List all insight templates (admin)' })
  @ApiResponse({ status: 200, description: 'Templates returned' })
  async getTemplates() {
    return this.service.getAllTemplates();
  }

  @Get()
  @ApiOperation({ summary: 'Get user insights (personalized, rendered)' })
  @ApiResponse({ status: 200, description: 'Insights returned' })
  async getUserInsights(
    @CurrentUser('id') userId: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.getUserInsights(userId, limit || 5);
  }

  @Patch(':id/click')
  @ApiOperation({ summary: 'Mark an insight as clicked' })
  @ApiResponse({ status: 200, description: 'Insight marked as clicked' })
  async markClicked(@Param('id', ParseIntPipe) id: number) {
    await this.service.markClicked(id);
    return { message: 'Marked as clicked' };
  }

  @Patch(':id/dismiss')
  @ApiOperation({ summary: 'Dismiss an insight' })
  @ApiResponse({ status: 200, description: 'Insight dismissed' })
  async markDismissed(@Param('id', ParseIntPipe) id: number) {
    await this.service.markDismissed(id);
    return { message: 'Dismissed' };
  }
}
