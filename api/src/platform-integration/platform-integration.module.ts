import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformCredential } from './entities/platform-credential.entity';
import { PlatformIntegrationService } from './platform-integration.service';
import { PlatformIntegrationController } from './platform-integration.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformCredential])],
  providers: [PlatformIntegrationService],
  controllers: [PlatformIntegrationController],
  exports: [PlatformIntegrationService],
})
export class PlatformIntegrationModule {}
