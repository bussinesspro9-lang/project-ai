import type { NotificationQueueItem, NotificationProvider } from './types';

const MAX_PER_DAY = 3;

export class NotificationQueue {
  private queue: NotificationQueueItem[] = [];
  private sentToday = new Map<number, number>();
  private lastResetDate = new Date().toDateString();

  constructor(private readonly provider: NotificationProvider) {}

  add(item: NotificationQueueItem): void {
    this.resetIfNewDay();

    const sentCount = this.sentToday.get(item.userId) || 0;
    if (sentCount >= MAX_PER_DAY) return;

    this.queue.push(item);
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  async flush(tokenResolver: (userId: number) => Promise<string | null>): Promise<number> {
    this.resetIfNewDay();
    let sent = 0;

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;

      const sentCount = this.sentToday.get(item.userId) || 0;
      if (sentCount >= MAX_PER_DAY) continue;

      if (item.scheduledAt && item.scheduledAt > new Date()) {
        this.queue.unshift(item);
        break;
      }

      const token = await tokenResolver(item.userId);
      if (!token) continue;

      const result = await this.provider.send(token, item.payload);
      if (result.success) {
        this.sentToday.set(item.userId, sentCount + 1);
        sent++;
      }
    }

    return sent;
  }

  get pending(): number {
    return this.queue.length;
  }

  private resetIfNewDay(): void {
    const today = new Date().toDateString();
    if (today !== this.lastResetDate) {
      this.sentToday.clear();
      this.lastResetDate = today;
    }
  }
}
