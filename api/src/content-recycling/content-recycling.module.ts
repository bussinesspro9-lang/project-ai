import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from '../content/entities/content.entity';
import { ContentRecyclingService } from './content-recycling.service';
import { ContentRecyclingController } from './content-recycling.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  providers: [ContentRecyclingService],
  controllers: [ContentRecyclingController],
})
export class ContentRecyclingModule {}
