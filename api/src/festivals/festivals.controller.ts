import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FestivalsService } from './festivals.service';

@ApiTags('Festivals')
@ApiBearerAuth()
@Controller('festivals')
export class FestivalsController {
  constructor(private readonly service: FestivalsService) {}

  @Get()
  @ApiOperation({ summary: 'List all active festivals' })
  @ApiResponse({ status: 200, description: 'Festivals returned' })
  async findAll() {
    return this.service.findAll();
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming festivals' })
  @ApiResponse({ status: 200, description: 'Upcoming festivals returned' })
  async upcoming(@Query('limit') limit?: number) {
    return this.service.findUpcoming(limit || 5);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a festival by ID' })
  @ApiResponse({ status: 200, description: 'Festival returned' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }
}
