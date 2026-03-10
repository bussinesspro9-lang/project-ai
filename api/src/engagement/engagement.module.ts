import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngagementInteraction } from './entities/engagement-interaction.entity';
import { EngagementService } from './engagement.service';
import { EngagementController } from './engagement.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EngagementInteraction])],
  providers: [EngagementService],
  controllers: [EngagementController],
  exports: [EngagementService],
})
export class EngagementModule {}
