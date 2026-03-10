import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ContentRecyclingService } from './content-recycling.service';

@ApiTags('Content Recycling')
@ApiBearerAuth()
@Controller('content/recycling')
export class ContentRecyclingController {
  constructor(private readonly service: ContentRecyclingService) {}

  @Get('suggestions')
  @ApiOperation({ summary: 'Get top-performing content suggestions for re-posting' })
  @ApiResponse({ status: 200, description: 'Recycle suggestions returned' })
  async getSuggestions(@CurrentUser('id') userId: number) {
    return this.service.getRecycleSuggestions(userId);
  }
}
