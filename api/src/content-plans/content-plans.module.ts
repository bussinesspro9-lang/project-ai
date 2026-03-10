import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ContentPlan } from './entities/content-plan.entity';
import { ContentPlanItem } from './entities/content-plan-item.entity';
import { ContentPlansService } from './content-plans.service';
import { ContentPlansController } from './content-plans.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentPlan, ContentPlanItem]),
    ScheduleModule.forRoot(),
  ],
  providers: [ContentPlansService],
  controllers: [ContentPlansController],
  exports: [ContentPlansService],
})
export class ContentPlansModule {}
