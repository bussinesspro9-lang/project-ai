import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AppController } from './app.controller';
import { DatabaseHealthService } from './health/database-health.service';

// Config
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import aiConfig from './config/ai.config';
import { loadApiEnv } from './config/load-env';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ContextModule } from './context/context.module';
import { AIModule } from './ai/ai.module';
import { ContentModule } from './content/content.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PlatformsModule } from './platforms/platforms.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { EmailModule } from './email/email.module';
import { UploadModule } from './upload/upload.module';
import { TemplateLibraryModule } from './template-library/template-library.module';
import { ContentPlansModule } from './content-plans/content-plans.module';
import { PersonalizationModule } from './personalization/personalization.module';
import { ReferralsModule } from './referrals/referrals.module';
import { ContentRecyclingModule } from './content-recycling/content-recycling.module';
import { EngagementModule } from './engagement/engagement.module';
import { FestivalsModule } from './festivals/festivals.module';
import { TrendingModule } from './trending/trending.module';
import { InsightsModule } from './insights/insights.module';
import { GamificationModule } from './gamification/gamification.module';
import { PlatformIntegrationModule } from './platform-integration/platform-integration.module';
import { N8nModule } from './n8n/n8n.module';
import { AppSettingsModule } from './app-settings/app-settings.module';
import { RealtimeModule } from './realtime/realtime.module';
import { MediaAssetsModule } from './media-assets/media-assets.module';

loadApiEnv();

@Module({
  imports: [
    // Configuration — single root .env for the entire monorepo
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [databaseConfig, jwtConfig, aiConfig],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Global Modules
    AppSettingsModule,
    RealtimeModule,
    MediaAssetsModule,
    EmailModule,
    UploadModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    SettingsModule,
    NotificationsModule,
    ContextModule,
    AIModule,
    ContentModule,
    AnalyticsModule,
    DashboardModule,
    PlatformsModule,
    SubscriptionsModule,
    SchedulerModule,
    OrganizationsModule,
    TemplateLibraryModule,
    ContentPlansModule,
    PersonalizationModule,
    ReferralsModule,
    ContentRecyclingModule,
    EngagementModule,
    FestivalsModule,
    TrendingModule,
    InsightsModule,
    GamificationModule,
    PlatformIntegrationModule,
    N8nModule,
  ],
  controllers: [AppController],
  providers: [
    DatabaseHealthService,
    // Global Exception Filter - Proper error responses
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Structured request logging with correlation IDs
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // Global rate limiter
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global JWT Guard - All routes protected by default
    // Use @Public() decorator to make routes public
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
