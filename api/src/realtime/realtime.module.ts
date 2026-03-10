import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeService } from './realtime.service';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot({ wildcard: true })],
  controllers: [RealtimeGateway],
  providers: [RealtimeService],
  exports: [RealtimeService],
})
export class RealtimeModule {}
