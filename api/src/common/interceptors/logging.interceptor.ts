import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const correlationId = (request.headers['x-correlation-id'] as string) || randomUUID();
    request.headers['x-correlation-id'] = correlationId;
    response.setHeader('x-correlation-id', correlationId);

    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '-';
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          const statusCode = response.statusCode;

          const logEntry = {
            correlationId,
            method,
            url: originalUrl,
            statusCode,
            duration: `${duration}ms`,
            ip,
            userAgent,
          };

          if (statusCode >= 400) {
            this.logger.warn(JSON.stringify(logEntry));
          } else {
            this.logger.log(JSON.stringify(logEntry));
          }
        },
        error: (error) => {
          const duration = Date.now() - start;
          const statusCode = error?.status || error?.getStatus?.() || 500;

          const logEntry = {
            correlationId,
            method,
            url: originalUrl,
            statusCode,
            duration: `${duration}ms`,
            ip,
            userAgent,
            error: error?.message,
          };

          this.logger.error(JSON.stringify(logEntry));
        },
      }),
    );
  }
}
