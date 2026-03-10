import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GamificationService } from './gamification.service';

@ApiTags('Gamification')
@ApiBearerAuth()
@Controller('gamification')
export class GamificationController {
  constructor(private readonly service: GamificationService) {}

  @Get('definitions')
  @ApiOperation({ summary: 'List all achievement definitions' })
  @ApiResponse({ status: 200, description: 'Definitions returned' })
  async getDefinitions() {
    return this.service.getAllDefinitions();
  }

  @Get('achievements')
  @ApiOperation({ summary: 'Get user achievements (unlocked + in-progress)' })
  @ApiResponse({ status: 200, description: 'User achievements returned' })
  async getUserAchievements(@CurrentUser('id') userId: number) {
    return this.service.getUserAchievements(userId);
  }
}
