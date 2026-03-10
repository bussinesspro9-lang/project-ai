import { Controller, Sse, Req, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map, filter, merge, interval } from 'rxjs';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export interface RealtimeEvent {
  userId: number;
  type: string;
  payload: Record<string, any>;
}

@ApiTags('Realtime')
@ApiBearerAuth()
@Controller('realtime')
export class RealtimeGateway {
  private readonly logger = new Logger(RealtimeGateway.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  @UseGuards(JwtAuthGuard)
  @Sse('events')
  @ApiOperation({ summary: 'SSE stream for real-time updates (per-user filtered)' })
  events(@Req() req: Request): Observable<MessageEvent> {
    const user = req.user as any;
    const userId = user?.id ?? user?.sub;

    this.logger.log(`SSE connection opened for user ${userId}`);

    const heartbeat$ = interval(30_000).pipe(
      map(() => ({ data: JSON.stringify({ type: 'heartbeat' }) }) as MessageEvent),
    );

    const events$ = fromEvent<RealtimeEvent>(this.eventEmitter, 'realtime.**').pipe(
      filter((event) => event.userId === userId),
      map(
        (event) =>
          ({
            data: JSON.stringify({ type: event.type, payload: event.payload }),
          }) as MessageEvent,
      ),
    );

    return merge(heartbeat$, events$);
  }
}
