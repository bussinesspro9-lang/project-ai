import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class N8nService {
  private readonly logger = new Logger(N8nService.name);
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('N8N_WEBHOOK_URL') || 'http://localhost:5678';
  }

  async triggerWorkflow(
    webhookPath: string,
    payload: Record<string, any>,
  ): Promise<any> {
    const url = `${this.baseUrl}/webhook/${webhookPath}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        this.logger.warn(`n8n webhook ${webhookPath} returned ${response.status}`);
        return null;
      }

      return response.json();
    } catch (error) {
      this.logger.warn(`n8n webhook ${webhookPath} failed: ${error.message}`);
      return null;
    }
  }

  async triggerAutoPublish(contentId: number, userId: number, platform: string): Promise<void> {
    await this.triggerWorkflow('auto-publish', { contentId, userId, platform });
  }

  async triggerTemplateGeneration(keywords: string[], businessType: string): Promise<void> {
    await this.triggerWorkflow('template-generate', { keywords, businessType });
  }
}
