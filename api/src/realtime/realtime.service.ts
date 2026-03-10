import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RealtimeEvent } from './realtime.gateway';

@Injectable()
export class RealtimeService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit(userId: number, type: string, payload: Record<string, any> = {}): void {
    const event: RealtimeEvent = { userId, type, payload };
    this.eventEmitter.emit(`realtime.${type}`, event);
  }

  contentUpdated(userId: number, contentId: number, status: string): void {
    this.emit(userId, 'content.updated', { contentId, status });
  }

  contentPublished(userId: number, contentId: number, platform: string): void {
    this.emit(userId, 'content.published', { contentId, platform });
  }

  engagementNew(userId: number, interactionId: number, interactionType: string): void {
    this.emit(userId, 'engagement.new', { interactionId, interactionType });
  }

  engagementResponded(userId: number, interactionId: number): void {
    this.emit(userId, 'engagement.responded', { interactionId });
  }

  planGenerated(userId: number, planId: number): void {
    this.emit(userId, 'plan.generated', { planId });
  }

  achievementUnlocked(userId: number, achievementId: number, title: string): void {
    this.emit(userId, 'achievement.unlocked', { achievementId, title });
  }

  streakUpdated(userId: number, currentStreak: number): void {
    this.emit(userId, 'streak.updated', { currentStreak });
  }

  insightNew(userId: number, insightId: number): void {
    this.emit(userId, 'insight.new', { insightId });
  }

  statsUpdated(userId: number, stats: Record<string, any>): void {
    this.emit(userId, 'stats.updated', stats);
  }
}
