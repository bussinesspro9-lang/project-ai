import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('n8n Webhooks')
@Controller('webhooks/n8n')
export class N8nController {
  @Public()
  @Post('content-published')
  @ApiOperation({ summary: 'Callback from n8n after content is published' })
  @ApiResponse({ status: 200, description: 'Acknowledged' })
  async contentPublished(
    @Body() body: { contentId: number; userId: number; status: string; platform: string },
  ) {
    return { received: true, contentId: body.contentId };
  }

  @Public()
  @Post('review-received')
  @ApiOperation({ summary: 'Callback from n8n when new review is detected' })
  @ApiResponse({ status: 200, description: 'Acknowledged' })
  async reviewReceived(
    @Body() body: { userId: number; platform: string; content: string; authorName: string; rating?: number },
  ) {
    return { received: true };
  }

  @Public()
  @Post('trending-update')
  @ApiOperation({ summary: 'Callback from n8n with trending topic data' })
  @ApiResponse({ status: 200, description: 'Acknowledged' })
  async trendingUpdate(
    @Body() body: { topics: any[] },
  ) {
    return { received: true, count: body.topics?.length || 0 };
  }
}
