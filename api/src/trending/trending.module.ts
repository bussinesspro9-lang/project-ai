import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrendingTopic } from './entities/trending-topic.entity';
import { TrendingService } from './trending.service';
import { TrendingController } from './trending.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TrendingTopic])],
  providers: [TrendingService],
  controllers: [TrendingController],
  exports: [TrendingService],
})
export class TrendingModule {}
