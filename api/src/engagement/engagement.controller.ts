import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { EngagementService } from './engagement.service';
import { InteractionType, ResponseStatus } from '../common/enums';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Engagement')
@ApiBearerAuth()
@Controller('engagement')
export class EngagementController {
  constructor(private readonly service: EngagementService) {}

  @Post('incoming')
  @Public()
  @ApiOperation({ summary: 'Receive incoming engagement (webhook from n8n)' })
  @ApiResponse({ status: 201, description: 'Interaction recorded' })
  async incoming(
    @Body()
    body: {
      userId: number;
      platform: string;
      interactionType: InteractionType;
      originalContent: string;
      externalId?: string;
      authorName?: string;
      authorProfileUrl?: string;
      sentiment?: string;
      aiResponse?: string;
      relatedContentId?: number;
      metadata?: Record<string, any>;
    },
  ) {
    return this.service.createIncoming(body.userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'List engagement interactions (inbox)' })
  @ApiResponse({ status: 200, description: 'Interactions returned' })
  async findAll(
    @CurrentUser('id') userId: number,
    @Query() query: PaginationDto & {
      platform?: string;
      interactionType?: InteractionType;
      sentiment?: string;
      responseStatus?: ResponseStatus;
    },
  ) {
    return this.service.findAll(userId, query);
  }

  @Patch(':id/respond')
  @ApiOperation({ summary: 'Manually respond to an interaction' })
  @ApiResponse({ status: 200, description: 'Response recorded' })
  async respond(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body('response') response: string,
  ) {
    return this.service.respond(userId, id, response);
  }

  @Patch(':id/skip')
  @ApiOperation({ summary: 'Skip/dismiss an interaction' })
  @ApiResponse({ status: 200, description: 'Interaction skipped' })
  async skip(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.service.skip(userId, id);
    return { message: 'Interaction skipped' };
  }

  @Post('suggest-comment')
  @ApiOperation({
    summary: 'Create a suggested outbound comment (requires user approval before posting)',
  })
  @ApiResponse({ status: 201, description: 'Suggested comment created' })
  async suggestComment(
    @CurrentUser('id') userId: number,
    @Body()
    body: {
      platform: string;
      targetPostUrl: string;
      suggestedComment: string;
      targetAccountName?: string;
      relatedContentId?: number;
      metadata?: Record<string, any>;
    },
  ) {
    return this.service.createSuggestedComment(userId, body);
  }

  @Patch(':id/approve')
  @ApiOperation({
    summary: 'Approve a suggested comment for posting',
  })
  @ApiResponse({ status: 200, description: 'Comment approved and queued for posting' })
  async approveSuggested(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body('editedComment') editedComment?: string,
  ) {
    return this.service.approveSuggested(userId, id, editedComment);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get engagement statistics' })
  @ApiResponse({ status: 200, description: 'Stats returned' })
  async getStats(@CurrentUser('id') userId: number) {
    return this.service.getStats(userId);
  }
}
