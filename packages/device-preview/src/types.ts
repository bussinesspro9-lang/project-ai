export type PreviewPlatform =
  | 'instagram_feed'
  | 'instagram_story'
  | 'facebook_post'
  | 'whatsapp_status'
  | 'google_business';

export interface PreviewContent {
  caption: string;
  hashtags?: string[];
  imageUrl?: string;
  businessName?: string;
  avatarUrl?: string;
  ctaText?: string;
}

export interface DeviceFrameProps {
  platform: PreviewPlatform;
  content: PreviewContent;
  width?: number;
  className?: string;
}
