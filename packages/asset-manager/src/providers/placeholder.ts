import type {
  AssetProvider,
  UploadOptions,
  UploadResult,
  DeleteResult,
  TransformOptions,
} from '../types';

export class PlaceholderProvider implements AssetProvider {
  private counter = 0;

  async upload(
    _file: Buffer | string,
    options: UploadOptions = {},
  ): Promise<UploadResult> {
    this.counter++;
    const publicId = options.publicId || `placeholder_${this.counter}`;

    return {
      url: `https://via.placeholder.com/400?text=${publicId}`,
      secureUrl: `https://via.placeholder.com/400?text=${publicId}`,
      publicId,
      format: 'png',
      width: 400,
      height: 400,
      bytes: 0,
      resourceType: 'image',
      originalFilename: 'placeholder.png',
    };
  }

  async delete(publicId: string): Promise<DeleteResult> {
    return { success: true, publicId };
  }

  getUrl(publicId: string, _transforms?: TransformOptions): string {
    return `https://via.placeholder.com/400?text=${publicId}`;
  }
}
