import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TrendingService } from './trending.service';

@ApiTags('Trending')
@ApiBearerAuth()
@Controller('trending')
export class TrendingController {
  constructor(private readonly service: TrendingService) {}

  @Get()
  @ApiOperation({ summary: 'Get active trending topics' })
  @ApiResponse({ status: 200, description: 'Trending topics returned' })
  async findActive(
    @Query('businessType') businessType?: string,
    @Query('limit') limit?: number,
  ) {
    return this.service.findActive(businessType, limit || 10);
  }

  @Post()
  @ApiOperation({ summary: 'Add a trending topic (admin/webhook)' })
  @ApiResponse({ status: 201, description: 'Topic added' })
  async addTopic(@Body() body: any) {
    return this.service.addTopic(body);
  }
}
