import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ContentPlansService } from './content-plans.service';
import { GeneratePlanDto, UpdatePlanItemDto } from './dto/generate-plan.dto';

@ApiTags('Content Plans')
@ApiBearerAuth()
@Controller('content-plans')
export class ContentPlansController {
  constructor(private readonly service: ContentPlansService) {}

  @Post('generate')
  @ApiOperation({ summary: 'AI-generate a weekly or monthly content plan' })
  @ApiResponse({ status: 201, description: 'Plan generated' })
  async generate(
    @CurrentUser('id') userId: number,
    @Body() dto: GeneratePlanDto,
  ) {
    return this.service.generate(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user content plans' })
  @ApiResponse({ status: 200, description: 'Plans list returned' })
  async findAll(@CurrentUser('id') userId: number) {
    return this.service.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a content plan with items' })
  @ApiResponse({ status: 200, description: 'Plan returned' })
  async findOne(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findById(userId, id);
  }

  @Patch(':planId/items/:itemId')
  @ApiOperation({ summary: 'Update a plan item (approve/reject/edit)' })
  @ApiResponse({ status: 200, description: 'Item updated' })
  async updateItem(
    @CurrentUser('id') userId: number,
    @Param('planId', ParseIntPipe) planId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdatePlanItemDto,
  ) {
    return this.service.updateItem(userId, planId, itemId, dto);
  }

  @Post(':id/approve-all')
  @ApiOperation({ summary: 'Approve entire plan, activate scheduling' })
  @ApiResponse({ status: 200, description: 'Plan approved' })
  async approveAll(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.approveAll(userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a content plan' })
  @ApiResponse({ status: 200, description: 'Plan cancelled' })
  async cancel(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.service.cancel(userId, id);
    return { message: 'Plan cancelled' };
  }
}
