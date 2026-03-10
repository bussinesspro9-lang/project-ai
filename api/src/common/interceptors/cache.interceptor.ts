import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

interface CacheEntry {
  data: any;
  expiresAt: number;
}

@Injectable()
export class InMemoryCacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Cache');
  private readonly cache = new Map<string, CacheEntry>();
  private readonly defaultTtl = 60_000; // 1 minute
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.cleanupInterval = setInterval(() => this.evictExpired(), 30_000);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.method !== 'GET') {
      return next.handle();
    }

    const userId = (request as any).user?.id || (request as any).user?.sub || 'anon';
    const key = `${userId}:${request.originalUrl}`;

    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return of(cached.data);
    }

    return next.handle().pipe(
      tap((data) => {
        this.cache.set(key, {
          data,
          expiresAt: Date.now() + this.defaultTtl,
        });
      }),
    );
  }

  private evictExpired() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
      }
    }
  }
}
