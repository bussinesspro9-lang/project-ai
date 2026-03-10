import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MediaAssetsService } from './media-assets.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { QueryMediaDto } from './dto/query-media.dto';

@ApiTags('Media Assets')
@ApiBearerAuth()
@Controller('media')
export class MediaAssetsController {
  constructor(private readonly mediaAssetsService: MediaAssetsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Record a media asset after CDN upload' })
  @ApiResponse({ status: 201, description: 'Asset recorded' })
  async upload(
    @CurrentUser('id') userId: number,
    @Body() dto: UploadMediaDto & { cdnUrl: string },
  ) {
    return this.mediaAssetsService.create(userId, dto.cdnUrl, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List media assets with filters' })
  @ApiResponse({ status: 200, description: 'Assets list returned' })
  async findAll(
    @CurrentUser('id') userId: number,
    @Query() query: QueryMediaDto,
  ) {
    return this.mediaAssetsService.findAll(userId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get storage usage stats' })
  @ApiResponse({ status: 200, description: 'Storage stats returned' })
  async getStats(@CurrentUser('id') userId: number) {
    return this.mediaAssetsService.getStorageStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single media asset by ID' })
  @ApiResponse({ status: 200, description: 'Asset returned' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mediaAssetsService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a media asset' })
  @ApiResponse({ status: 200, description: 'Asset deleted' })
  @ApiResponse({ status: 404, description: 'Asset not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.mediaAssetsService.remove(id);
    return { message: 'Asset deleted' };
  }
}
