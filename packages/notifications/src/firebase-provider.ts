import type { NotificationProvider, NotificationPayload } from './types';

export interface FirebaseConfig {
  projectId: string;
  privateKey: string;
  clientEmail: string;
}

export class FirebaseProvider implements NotificationProvider {
  constructor(private readonly config: FirebaseConfig) {}

  async send(
    token: string,
    payload: NotificationPayload,
  ): Promise<{ success: boolean; messageId?: string }> {
    const accessToken = await this.getAccessToken();

    const url = `https://fcm.googleapis.com/v1/projects/${this.config.projectId}/messages:send`;

    const message = {
      message: {
        token,
        notification: {
          title: payload.title,
          body: payload.body,
          ...(payload.imageUrl && { image: payload.imageUrl }),
        },
        data: payload.data,
        webpush: payload.clickAction
          ? { fcm_options: { link: payload.clickAction } }
          : undefined,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      return { success: response.ok, messageId: result.name };
    } catch {
      return { success: false };
    }
  }

  async sendToMultiple(
    tokens: string[],
    payload: NotificationPayload,
  ): Promise<{ successCount: number; failureCount: number }> {
    let successCount = 0;
    let failureCount = 0;

    for (const token of tokens) {
      const result = await this.send(token, payload);
      if (result.success) successCount++;
      else failureCount++;
    }

    return { successCount, failureCount };
  }

  private async getAccessToken(): Promise<string> {
    // In production, use google-auth-library or service account JWT
    // For now, return a placeholder that will be replaced with real implementation
    return 'firebase-access-token';
  }
}
