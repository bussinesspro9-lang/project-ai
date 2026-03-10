import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiKey: string | undefined;
  private readonly fromEmail: string;
  private readonly isDev: boolean;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.fromEmail = this.configService.get<string>('EMAIL_FROM') || 'BusinessPro <noreply@businesspro.app>';
    this.isDev = this.configService.get<string>('NODE_ENV') !== 'production';
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    if (!this.apiKey) {
      this.logger.warn(`[DEV] Email not sent (no RESEND_API_KEY). To: ${options.to}, Subject: ${options.subject}`);
      this.logger.debug(`[DEV] Email body:\n${options.text || options.html}`);
      return true;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: [options.to],
          subject: options.subject,
          html: options.html,
          ...(options.text ? { text: options.text } : {}),
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        this.logger.error(`Failed to send email: ${error}`);
        return false;
      }

      this.logger.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Email send error: ${error.message}`);
      return false;
    }
  }

  async sendOtpEmail(email: string, otp: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Your BusinessPro Verification Code',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #7c3aed; margin-bottom: 24px;">Password Reset</h2>
          <p>Your verification code is:</p>
          <div style="background: #f4f3ff; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #7c3aed;">${otp}</span>
          </div>
          <p style="color: #666; font-size: 14px;">This code expires in 10 minutes. Do not share it with anyone.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
      text: `Your BusinessPro verification code is: ${otp}. It expires in 10 minutes.`,
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to BusinessPro!',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #7c3aed;">Welcome, ${name}!</h2>
          <p>Your BusinessPro account is ready. Start creating AI-powered social media content for your business.</p>
          <a href="${this.configService.get('FRONTEND_URL') || 'http://localhost:3001'}/dashboard"
             style="display: inline-block; background: #7c3aed; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
            Go to Dashboard
          </a>
        </div>
      `,
    });
  }
}
