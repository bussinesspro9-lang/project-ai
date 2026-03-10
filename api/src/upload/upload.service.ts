import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly cloudName: string | undefined;
  private readonly apiKey: string | undefined;
  private readonly apiSecret: string | undefined;

  constructor(private configService: ConfigService) {
    this.cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    this.apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    this.apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');
  }

  private get isConfigured(): boolean {
    return !!(this.cloudName && this.apiKey && this.apiSecret);
  }

  async uploadImage(
    fileBuffer: Buffer,
    options: { folder?: string; publicId?: string; transformation?: string } = {},
  ): Promise<UploadResult> {
    if (!this.isConfigured) {
      this.logger.warn('Cloudinary not configured. Returning placeholder URL.');
      return {
        url: `https://placehold.co/400x400/7c3aed/white?text=Avatar`,
        publicId: 'placeholder',
      };
    }

    const folder = options.folder || 'businesspro';
    const timestamp = Math.round(Date.now() / 1000);

    const params: Record<string, string> = {
      timestamp: String(timestamp),
      folder,
    };
    if (options.publicId) params.public_id = options.publicId;
    if (options.transformation) params.transformation = options.transformation;

    const signature = await this.generateSignature(params);

    const formData = new FormData();
    formData.append('file', new Blob([new Uint8Array(fileBuffer)]));
    formData.append('api_key', this.apiKey!);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);
    formData.append('folder', folder);
    if (options.publicId) formData.append('public_id', options.publicId);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        { method: 'POST', body: formData },
      );

      if (!response.ok) {
        const error = await response.text();
        throw new BadRequestException(`Upload failed: ${error}`);
      }

      const data = await response.json();

      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      };
    } catch (error) {
      this.logger.error(`Upload error: ${error.message}`);
      throw new BadRequestException('File upload failed');
    }
  }

  async deleteImage(publicId: string): Promise<boolean> {
    if (!this.isConfigured) return true;

    const timestamp = Math.round(Date.now() / 1000);
    const params = { public_id: publicId, timestamp: String(timestamp) };
    const signature = await this.generateSignature(params);

    try {
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', this.apiKey!);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`,
        { method: 'POST', body: formData },
      );

      return response.ok;
    } catch (error) {
      this.logger.error(`Delete error: ${error.message}`);
      return false;
    }
  }

  private async generateSignature(params: Record<string, string>): Promise<string> {
    const sorted = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    const toSign = sorted + this.apiSecret;

    const encoder = new TextEncoder();
    const data = encoder.encode(toSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}
