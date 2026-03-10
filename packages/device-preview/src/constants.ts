import type { PreviewPlatform } from './types';

export const PLATFORM_DIMENSIONS: Record<
  PreviewPlatform,
  { width: number; height: number; aspectRatio: string }
> = {
  instagram_feed: { width: 1080, height: 1080, aspectRatio: '1:1' },
  instagram_story: { width: 1080, height: 1920, aspectRatio: '9:16' },
  facebook_post: { width: 1200, height: 630, aspectRatio: '1.91:1' },
  whatsapp_status: { width: 1080, height: 1920, aspectRatio: '9:16' },
  google_business: { width: 1200, height: 900, aspectRatio: '4:3' },
};

export function getPlatformLabel(platform: PreviewPlatform): string {
  const labels: Record<PreviewPlatform, string> = {
    instagram_feed: 'Instagram Feed',
    instagram_story: 'Instagram Story',
    facebook_post: 'Facebook Post',
    whatsapp_status: 'WhatsApp Status',
    google_business: 'Google Business',
  };
  return labels[platform];
}
