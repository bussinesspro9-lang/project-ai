import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaAsset } from './entities/media-asset.entity';
import { Translation } from './entities/translation.entity';
import { MediaAssetsService } from './media-assets.service';
import { MediaAssetsController } from './media-assets.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([MediaAsset, Translation])],
  providers: [MediaAssetsService],
  controllers: [MediaAssetsController],
  exports: [MediaAssetsService],
})
export class MediaAssetsModule {}
