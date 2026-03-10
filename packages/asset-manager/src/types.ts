export interface UploadOptions {
  folder?: string;
  publicId?: string;
  transformation?: Record<string, any>;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  tags?: string[];
}

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  resourceType: string;
  originalFilename?: string;
  duration?: number;
}

export interface DeleteResult {
  success: boolean;
  publicId: string;
}

export interface TransformOptions {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  format?: string;
  gravity?: string;
}

export interface AssetProvider {
  upload(
    file: Buffer | string,
    options?: UploadOptions,
  ): Promise<UploadResult>;

  delete(publicId: string): Promise<DeleteResult>;

  getUrl(publicId: string, transforms?: TransformOptions): string;
}
