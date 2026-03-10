import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReferralsService } from './referrals.service';

@ApiTags('Referrals')
@ApiBearerAuth()
@Controller('referrals')
export class ReferralsController {
  constructor(private readonly service: ReferralsService) {}

  @Get('my-code')
  @ApiOperation({ summary: 'Get user referral code and link' })
  @ApiResponse({ status: 200, description: 'Referral code returned' })
  async getMyCode(@CurrentUser('id') userId: number) {
    return this.service.getMyCode(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get referral statistics' })
  @ApiResponse({ status: 200, description: 'Referral stats returned' })
  async getStats(@CurrentUser('id') userId: number) {
    return this.service.getStats(userId);
  }

  @Post('apply')
  @ApiOperation({ summary: 'Apply a referral code during signup' })
  @ApiResponse({ status: 200, description: 'Referral applied' })
  async apply(
    @CurrentUser('id') userId: number,
    @Body('code') code: string,
  ) {
    await this.service.applyCode(userId, code);
    return { message: 'Referral code applied successfully' };
  }
}
