import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreferences } from './entities/user-preferences.entity';
import { UserPreferenceSignal } from './entities/user-preference-signal.entity';
import { PersonalizationService } from './personalization.service';
import { PersonalizationController } from './personalization.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserPreferences, UserPreferenceSignal])],
  providers: [PersonalizationService],
  controllers: [PersonalizationController],
  exports: [PersonalizationService],
})
export class PersonalizationModule {}
