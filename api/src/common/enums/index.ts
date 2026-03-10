/**
 * Common Enums - Shared across all modules
 */

export enum BusinessType {
  CAFE = 'cafe',
  KIRANA = 'kirana',
  SALON = 'salon',
  GYM = 'gym',
  CLINIC = 'clinic',
  RESTAURANT = 'restaurant',
  BOUTIQUE = 'boutique',
  TEA_SHOP = 'tea-shop',
}

export enum Platform {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  WHATSAPP = 'whatsapp',
  GOOGLE_BUSINESS = 'google-business',
}

export enum ContentStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  FAILED = 'failed',
}

export enum ContentGoal {
  PROMOTION = 'promotion',
  AWARENESS = 'awareness',
  ENGAGEMENT = 'engagement',
  FESTIVAL = 'festival',
  OFFER = 'offer',
}

export enum Tone {
  FRIENDLY = 'friendly',
  PROFESSIONAL = 'professional',
  FUN = 'fun',
  MINIMAL = 'minimal',
}

export enum Language {
  ENGLISH = 'english',
  HINDI = 'hindi',
  HINGLISH = 'hinglish',
}

export enum VisualStyle {
  CLEAN = 'clean',
  FESTIVE = 'festive',
  MODERN = 'modern',
  BOLD = 'bold',
}

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum ScheduleStatus {
  SCHEDULED = 'scheduled',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export enum PublishStatus {
  QUEUED = 'queued',
  PUBLISHING = 'publishing',
  PUBLISHED = 'published',
  FAILED = 'failed',
}

export enum AppSettingValueType {
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  STRING = 'string',
  JSON = 'json',
}

export enum AppSettingCategory {
  BILLING = 'billing',
  FEATURES = 'features',
  LIMITS = 'limits',
  SYSTEM = 'system',
}

export enum AssetType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  ICON = 'icon',
  BADGE = 'badge',
  BANNER = 'banner',
  DOCUMENT = 'document',
}

export enum AssetCategory {
  AVATAR = 'avatar',
  CONTENT_MEDIA = 'content_media',
  BADGE_ICON = 'badge_icon',
  ACHIEVEMENT_ICON = 'achievement_icon',
  FESTIVAL_BANNER = 'festival_banner',
  BRAND_ASSET = 'brand_asset',
  AI_GENERATED = 'ai_generated',
  SYSTEM_ICON = 'system_icon',
  TEMPLATE_VISUAL = 'template_visual',
  PLATFORM_ASSET = 'platform_asset',
}

export enum CdnProvider {
  CLOUDINARY = 'cloudinary',
  S3 = 's3',
  BUNNY = 'bunny',
  LOCAL = 'local',
}

export enum TranslationEntityType {
  TEMPLATE = 'template',
  INSIGHT_TEMPLATE = 'insight_template',
  ACHIEVEMENT = 'achievement',
  FESTIVAL = 'festival',
}

export enum TemplateCategory {
  FESTIVAL = 'festival',
  PROMOTION = 'promotion',
  ENGAGEMENT = 'engagement',
  SEASONAL = 'seasonal',
  INDUSTRY = 'industry',
  MILESTONE = 'milestone',
}

export enum Region {
  NORTH_INDIA = 'north_india',
  SOUTH_INDIA = 'south_india',
  EAST_INDIA = 'east_india',
  WEST_INDIA = 'west_india',
  CENTRAL_INDIA = 'central_india',
  PAN_INDIA = 'pan_india',
}

export enum ContentPlanStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PlanItemStatus {
  SUGGESTED = 'suggested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
}

export enum PreferenceSignalType {
  TONE_OVERRIDE = 'tone_override',
  LANGUAGE_CHOICE = 'language_choice',
  PLATFORM_AFFINITY = 'platform_affinity',
  CATEGORY_PREFERENCE = 'category_preference',
  CAPTION_LENGTH = 'caption_length',
  HASHTAG_PREFERENCE = 'hashtag_preference',
  POSTING_TIME = 'posting_time',
  TEMPLATE_CHOICE = 'template_choice',
  TEMPLATE_SKIP = 'template_skip',
  CONTENT_EDIT = 'content_edit',
  REGENERATION = 'regeneration',
  VISUAL_STYLE = 'visual_style',
  CTA_CHOICE = 'cta_choice',
  EMOJI_USAGE = 'emoji_usage',
  CONTENT_GOAL = 'content_goal',
}

export enum CaptionLength {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
}

export enum EmojiDensity {
  NONE = 'none',
  LIGHT = 'light',
  HEAVY = 'heavy',
}

export enum ReferralStatus {
  PENDING = 'pending',
  SIGNED_UP = 'signed_up',
  ACTIVATED = 'activated',
  REWARDED = 'rewarded',
}

export enum ReferralRewardType {
  FREE_DAYS = 'free_days',
  CREDITS = 'credits',
  FEATURE_UNLOCK = 'feature_unlock',
}

export enum InteractionType {
  REVIEW = 'review',
  COMMENT = 'comment',
  DM = 'dm',
  MENTION = 'mention',
  SUGGESTED_COMMENT = 'suggested_comment',
}

export enum InteractionDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export enum ResponseStatus {
  PENDING = 'pending',
  AUTO_RESPONDED = 'auto_responded',
  MANUALLY_RESPONDED = 'manually_responded',
  SUGGESTED = 'suggested',
  POSTED = 'posted',
  SKIPPED = 'skipped',
  EXPIRED = 'expired',
}

export enum FestivalType {
  NATIONAL = 'national',
  REGIONAL = 'regional',
  RELIGIOUS = 'religious',
  COMMERCIAL = 'commercial',
  SEASONAL = 'seasonal',
}

export enum InsightCategory {
  PERFORMANCE = 'performance',
  TIMING = 'timing',
  CONTENT_TYPE = 'content_type',
  AUDIENCE = 'audience',
  TREND = 'trend',
  STREAK = 'streak',
  MILESTONE = 'milestone',
}

export enum InsightTone {
  ENCOURAGING = 'encouraging',
  ANALYTICAL = 'analytical',
  PLAYFUL = 'playful',
  URGENT = 'urgent',
}

export enum AchievementCategory {
  POSTING = 'posting',
  ENGAGEMENT = 'engagement',
  CONSISTENCY = 'consistency',
  GROWTH = 'growth',
  LEARNING = 'learning',
}

export enum AchievementConditionType {
  COUNT = 'count',
  STREAK = 'streak',
  MILESTONE = 'milestone',
  SPECIAL = 'special',
}

export enum BadgeTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}
