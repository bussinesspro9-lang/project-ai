import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TemplateLibraryService } from './template-library.service';
import { QueryTemplatesDto } from './dto/query-templates.dto';

@ApiTags('Template Library')
@ApiBearerAuth()
@Controller('templates/library')
export class TemplateLibraryController {
  constructor(private readonly service: TemplateLibraryService) {}

  @Get()
  @ApiOperation({ summary: 'Browse/search templates with filters' })
  @ApiResponse({ status: 200, description: 'Templates list returned' })
  async findAll(@Query() query: QueryTemplatesDto) {
    return this.service.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured/curated templates' })
  @ApiResponse({ status: 200, description: 'Featured templates returned' })
  async findFeatured() {
    return this.service.findFeatured();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single template by ID' })
  @ApiResponse({ status: 200, description: 'Template returned' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post(':id/use')
  @ApiOperation({ summary: 'Mark template as used by current user' })
  @ApiResponse({ status: 201, description: 'Usage recorded' })
  async useTemplate(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body('customizedContent') customizedContent?: string,
  ) {
    return this.service.recordUsage(userId, id, customizedContent);
  }
}
