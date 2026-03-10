export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  clickAction?: string;
}

export interface NotificationProvider {
  send(
    token: string,
    payload: NotificationPayload,
  ): Promise<{ success: boolean; messageId?: string }>;

  sendToMultiple(
    tokens: string[],
    payload: NotificationPayload,
  ): Promise<{ successCount: number; failureCount: number }>;
}

export interface NotificationQueueItem {
  userId: number;
  payload: NotificationPayload;
  scheduledAt?: Date;
  priority: number;
}
