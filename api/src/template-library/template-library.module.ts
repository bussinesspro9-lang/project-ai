import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entities/template.entity';
import { UserTemplateHistory } from './entities/user-template-history.entity';
import { TemplateLibraryService } from './template-library.service';
import { TemplateLibraryController } from './template-library.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Template, UserTemplateHistory])],
  providers: [TemplateLibraryService],
  controllers: [TemplateLibraryController],
  exports: [TemplateLibraryService],
})
export class TemplateLibraryModule {}
