import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Festival } from './entities/festival.entity';
import { FestivalsService } from './festivals.service';
import { FestivalsController } from './festivals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Festival])],
  providers: [FestivalsService],
  controllers: [FestivalsController],
  exports: [FestivalsService],
})
export class FestivalsModule {}
