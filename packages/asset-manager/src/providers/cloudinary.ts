import type {
  AssetProvider,
  UploadOptions,
  UploadResult,
  DeleteResult,
  TransformOptions,
} from '../types';

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export class CloudinaryProvider implements AssetProvider {
  private readonly baseUploadUrl: string;
  private readonly baseDeliveryUrl: string;

  constructor(private readonly config: CloudinaryConfig) {
    this.baseUploadUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}`;
    this.baseDeliveryUrl = `https://res.cloudinary.com/${config.cloudName}`;
  }

  async upload(
    file: Buffer | string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    const resourceType = options.resourceType || 'auto';
    const url = `${this.baseUploadUrl}/${resourceType}/upload`;

    const timestamp = Math.round(Date.now() / 1000);
    const params: Record<string, string> = {
      timestamp: String(timestamp),
    };

    if (options.folder) params.folder = options.folder;
    if (options.publicId) params.public_id = options.publicId;
    if (options.tags?.length) params.tags = options.tags.join(',');

    const signature = await this.generateSignature(params);

    const formData = new FormData();
    formData.append('api_key', this.config.apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);

    for (const [key, value] of Object.entries(params)) {
      if (key !== 'timestamp') formData.append(key, value);
    }

    if (typeof file === 'string') {
      formData.append('file', file);
    } else {
      formData.append('file', new Blob([new Uint8Array(file)]));
    }

    const response = await fetch(url, { method: 'POST', body: formData });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${data.error?.message || JSON.stringify(data)}`);
    }

    return {
      url: data.url,
      secureUrl: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height,
      bytes: data.bytes,
      resourceType: data.resource_type,
      originalFilename: data.original_filename,
      duration: data.duration,
    };
  }

  async delete(publicId: string): Promise<DeleteResult> {
    const timestamp = Math.round(Date.now() / 1000);
    const params = { public_id: publicId, timestamp: String(timestamp) };
    const signature = await this.generateSignature(params);

    const url = `${this.baseUploadUrl}/image/destroy`;
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', this.config.apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);

    const response = await fetch(url, { method: 'POST', body: formData });
    const data = await response.json();

    return {
      success: data.result === 'ok',
      publicId,
    };
  }

  getUrl(publicId: string, transforms?: TransformOptions): string {
    const parts: string[] = [];

    if (transforms) {
      const t: string[] = [];
      if (transforms.width) t.push(`w_${transforms.width}`);
      if (transforms.height) t.push(`h_${transforms.height}`);
      if (transforms.crop) t.push(`c_${transforms.crop}`);
      if (transforms.quality) t.push(`q_${transforms.quality}`);
      if (transforms.format) t.push(`f_${transforms.format}`);
      if (transforms.gravity) t.push(`g_${transforms.gravity}`);
      if (t.length) parts.push(t.join(','));
    }

    const transformStr = parts.length ? `${parts.join('/')}/` : '';
    return `${this.baseDeliveryUrl}/image/upload/${transformStr}${publicId}`;
  }

  private async generateSignature(
    params: Record<string, string>,
  ): Promise<string> {
    const sorted = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    const stringToSign = sorted + this.config.apiSecret;

    const crypto = await import('crypto');
    return crypto.createHash('sha1').update(stringToSign).digest('hex');
  }
}
