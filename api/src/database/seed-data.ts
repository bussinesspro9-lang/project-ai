import type { AppSetting } from '../app-settings/entities/app-setting.entity';
import type { AchievementDefinition } from '../gamification/entities/achievement-definition.entity';
import type { Template } from '../template-library/entities/template.entity';
import type { InsightTemplate } from '../insights/entities/insight-template.entity';
import type { Festival } from '../festivals/entities/festival.entity';
import {
  AppSettingValueType,
  AppSettingCategory,
  AchievementCategory,
  AchievementConditionType,
  BadgeTier,
  TemplateCategory,
  Region,
  InsightCategory,
  InsightTone,
  FestivalType,
} from '../common/enums';

// ─── App Settings ───────────────────────────────────────────────────────────────

export interface AppSettingSeed {
  key: string;
  value: string;
  valueType: AppSettingValueType;
  description: string;
  category: AppSettingCategory;
}

export const SEED_APP_SETTINGS: AppSettingSeed[] = [
  {
    key: 'is_free_mode',
    value: 'true',
    valueType: AppSettingValueType.BOOLEAN,
    description: 'When true, all features are unlocked and no plan enforcement applies',
    category: AppSettingCategory.BILLING,
  },
  {
    key: 'watermark_enabled',
    value: 'true',
    valueType: AppSettingValueType.BOOLEAN,
    description: 'When true, "Created with BusinessPro" watermark is added to free-tier content',
    category: AppSettingCategory.FEATURES,
  },
  {
    key: 'max_free_generations_per_month',
    value: '50',
    valueType: AppSettingValueType.NUMBER,
    description: 'Maximum AI generations per user per month on the free plan (when free mode is OFF)',
    category: AppSettingCategory.LIMITS,
  },
  {
    key: 'referral_reward_days',
    value: '30',
    valueType: AppSettingValueType.NUMBER,
    description: 'Number of free premium days awarded for each successful referral',
    category: AppSettingCategory.BILLING,
  },
  {
    key: 'maintenance_mode',
    value: 'false',
    valueType: AppSettingValueType.BOOLEAN,
    description: 'When true, the app shows a maintenance page to all users',
    category: AppSettingCategory.SYSTEM,
  },
  {
    key: 'onboarding_auto_plan',
    value: 'true',
    valueType: AppSettingValueType.BOOLEAN,
    description: 'When true, auto-generate a 7-day content plan after new user onboarding',
    category: AppSettingCategory.FEATURES,
  },
  {
    key: 'default_ai_model',
    value: 'gpt-4o-mini',
    valueType: AppSettingValueType.STRING,
    description: 'Default AI model used for content generation',
    category: AppSettingCategory.SYSTEM,
  },
];

// ─── Achievement Definitions ────────────────────────────────────────────────────

export const SEED_ACHIEVEMENTS: Partial<AchievementDefinition>[] = [
  { slug: 'first-post', title: 'First Post', description: 'Publish your first content', category: AchievementCategory.POSTING, conditionType: AchievementConditionType.COUNT, conditionValue: 1, xpReward: 10, badgeTier: BadgeTier.BRONZE },
  { slug: 'content-creator-10', title: 'Content Creator', description: 'Create 10 posts', category: AchievementCategory.POSTING, conditionType: AchievementConditionType.COUNT, conditionValue: 10, xpReward: 25, badgeTier: BadgeTier.SILVER },
  { slug: 'content-machine-50', title: 'Content Machine', description: 'Create 50 posts', category: AchievementCategory.POSTING, conditionType: AchievementConditionType.COUNT, conditionValue: 50, xpReward: 50, badgeTier: BadgeTier.GOLD },
  { slug: 'consistency-king-7', title: 'Consistency King', description: '7-day posting streak', category: AchievementCategory.CONSISTENCY, conditionType: AchievementConditionType.STREAK, conditionValue: 7, xpReward: 30, badgeTier: BadgeTier.SILVER },
  { slug: 'iron-streak-30', title: 'Iron Streak', description: '30-day posting streak', category: AchievementCategory.CONSISTENCY, conditionType: AchievementConditionType.STREAK, conditionValue: 30, xpReward: 100, badgeTier: BadgeTier.PLATINUM },
  { slug: 'festival-spirit', title: 'Festival Spirit', description: 'Create festival content for 3 different festivals', category: AchievementCategory.POSTING, conditionType: AchievementConditionType.COUNT, conditionValue: 3, xpReward: 20, badgeTier: BadgeTier.BRONZE },
  { slug: 'multilingual', title: 'Multilingual', description: 'Post in 3 different languages', category: AchievementCategory.POSTING, conditionType: AchievementConditionType.COUNT, conditionValue: 3, xpReward: 25, badgeTier: BadgeTier.SILVER },
  { slug: 'engagement-master', title: 'Engagement Master', description: 'Respond to 50 comments/reviews', category: AchievementCategory.ENGAGEMENT, conditionType: AchievementConditionType.COUNT, conditionValue: 50, xpReward: 40, badgeTier: BadgeTier.GOLD },
  { slug: 'template-explorer', title: 'Template Explorer', description: 'Use 10 different templates', category: AchievementCategory.LEARNING, conditionType: AchievementConditionType.COUNT, conditionValue: 10, xpReward: 15, badgeTier: BadgeTier.BRONZE },
  { slug: 'planning-pro', title: 'Planning Pro', description: 'Generate and complete a monthly plan', category: AchievementCategory.CONSISTENCY, conditionType: AchievementConditionType.MILESTONE, conditionValue: 1, xpReward: 35, badgeTier: BadgeTier.SILVER },
  { slug: 'referral-champion', title: 'Referral Champion', description: 'Successfully refer 5 friends', category: AchievementCategory.GROWTH, conditionType: AchievementConditionType.COUNT, conditionValue: 5, xpReward: 50, badgeTier: BadgeTier.GOLD },
  { slug: 'early-bird', title: 'Early Bird', description: 'Post before 9 AM for 5 days', category: AchievementCategory.CONSISTENCY, conditionType: AchievementConditionType.COUNT, conditionValue: 5, xpReward: 20, badgeTier: BadgeTier.BRONZE },
];

// ─── Content Templates ──────────────────────────────────────────────────────────

export const SEED_TEMPLATES: Partial<Template>[] = [
  { slug: 'diwali-offer-restaurant', title: 'Diwali Special Offer', category: TemplateCategory.FESTIVAL, subcategory: 'diwali', contentSkeleton: '🪔 Diwali Special at {{business_name}}! Get {{discount}}% off on all orders. Celebrate the festival of lights with amazing food! 🎉\n\n#DiwaliOffer #{{city}}Food #FestivalSpecial', hashtagTemplate: '#DiwaliOffer #FestivalOfLights #{{business_type}}', ctaTemplate: 'Order Now!', platforms: ['instagram', 'facebook', 'whatsapp'], businessTypes: ['restaurant', 'cafe'], languages: ['english', 'hinglish'], tone: 'fun', region: Region.PAN_INDIA, tags: ['diwali', 'festival', 'offer', 'discount'], keywords: ['diwali', 'offer', 'festival', 'lights'] },
  { slug: 'holi-celebration', title: 'Holi Celebration Post', category: TemplateCategory.FESTIVAL, subcategory: 'holi', contentSkeleton: '🎨 Happy Holi from {{business_name}}! 🌈 This Holi, add colors to your life with our special {{product_or_service}}. Rang barse! 💜💛💚\n\n#HappyHoli #{{city}}', hashtagTemplate: '#HappyHoli #FestivalOfColors #ColorfulLife', ctaTemplate: 'Visit us today!', platforms: ['instagram', 'facebook'], businessTypes: ['restaurant', 'salon', 'boutique', 'cafe'], languages: ['english', 'hinglish', 'hindi'], tone: 'fun', region: Region.PAN_INDIA, tags: ['holi', 'festival', 'colors'], keywords: ['holi', 'colors', 'festival'] },
  { slug: 'grand-opening', title: 'Grand Opening Announcement', category: TemplateCategory.MILESTONE, subcategory: 'grand_opening', contentSkeleton: '🎉 We\'re OPEN! {{business_name}} is now ready to serve you at {{location}}. Come visit us and enjoy our opening specials!\n\n✨ {{special_offer}}\n📍 {{address}}\n⏰ {{timing}}', hashtagTemplate: '#GrandOpening #NewIn{{city}} #{{business_type}}', ctaTemplate: 'Visit Now', platforms: ['instagram', 'facebook', 'google-business', 'whatsapp'], businessTypes: ['restaurant', 'cafe', 'salon', 'gym', 'clinic', 'boutique', 'kirana'], languages: ['english'], tone: 'friendly', region: Region.PAN_INDIA, tags: ['opening', 'new', 'launch'], keywords: ['grand opening', 'new', 'launch', 'inauguration'] },
  { slug: 'weekend-special', title: 'Weekend Special Offer', category: TemplateCategory.PROMOTION, subcategory: 'weekend', contentSkeleton: '🌟 Weekend vibes at {{business_name}}! 🎯\n\nThis Saturday & Sunday, enjoy:\n{{offer_details}}\n\nDon\'t miss out! Tag your weekend crew 👯‍♂️\n\n#WeekendSpecial #{{city}}', hashtagTemplate: '#WeekendVibes #WeekendOffer #{{city}}Deals', ctaTemplate: 'Book Now', platforms: ['instagram', 'facebook', 'whatsapp'], businessTypes: ['restaurant', 'cafe', 'salon', 'gym'], languages: ['english', 'hinglish'], tone: 'fun', region: Region.PAN_INDIA, tags: ['weekend', 'offer', 'special'], keywords: ['weekend', 'saturday', 'sunday', 'offer'] },
  { slug: 'customer-testimonial', title: 'Happy Customer Story', category: TemplateCategory.ENGAGEMENT, subcategory: 'testimonial', contentSkeleton: '⭐ What our customers say about {{business_name}}:\n\n"{{testimonial_text}}"\n- {{customer_name}}\n\nThank you for your love! 🙏 Your trust means everything to us.\n\n#HappyCustomer #{{business_type}} #{{city}}', hashtagTemplate: '#CustomerLove #Testimonial #TrustedBy{{city}}', ctaTemplate: 'Share your experience!', platforms: ['instagram', 'facebook', 'google-business'], businessTypes: ['restaurant', 'cafe', 'salon', 'gym', 'clinic'], languages: ['english'], tone: 'professional', region: Region.PAN_INDIA, tags: ['testimonial', 'review', 'customer'], keywords: ['review', 'customer', 'testimonial', 'feedback'] },
  { slug: 'flash-sale', title: 'Flash Sale Announcement', category: TemplateCategory.PROMOTION, subcategory: 'flash_sale', contentSkeleton: '⚡ FLASH SALE at {{business_name}}! ⚡\n\n🔥 {{discount}}% OFF on {{product_service}}\n⏰ Only for the next {{hours}} hours!\n\nHurry, limited time only! 🏃‍♂️\n\n#FlashSale #LimitedOffer #{{city}}', hashtagTemplate: '#FlashSale #HurryUp #LimitedTime', ctaTemplate: 'Shop Now!', platforms: ['instagram', 'facebook', 'whatsapp'], businessTypes: ['boutique', 'restaurant', 'salon', 'kirana'], languages: ['english', 'hinglish'], tone: 'fun', region: Region.PAN_INDIA, tags: ['sale', 'flash', 'discount', 'urgent'], keywords: ['sale', 'discount', 'flash', 'limited'] },
  { slug: 'new-product-launch', title: 'New Product Launch', category: TemplateCategory.PROMOTION, subcategory: 'new_product', contentSkeleton: '🆕 Introducing {{product_name}} at {{business_name}}! 🎊\n\n{{product_description}}\n\n✅ {{feature_1}}\n✅ {{feature_2}}\n✅ {{feature_3}}\n\nAvailable now! Come try it 😍\n\n#NewLaunch #{{business_type}} #{{city}}', hashtagTemplate: '#NewProduct #JustLaunched #TryNow', ctaTemplate: 'Try Now', platforms: ['instagram', 'facebook'], businessTypes: ['restaurant', 'cafe', 'salon', 'boutique', 'gym'], languages: ['english'], tone: 'friendly', region: Region.PAN_INDIA, tags: ['new', 'launch', 'product'], keywords: ['new', 'launch', 'product', 'introducing'] },
  { slug: 'monsoon-special', title: 'Monsoon Season Special', category: TemplateCategory.SEASONAL, subcategory: 'monsoon', contentSkeleton: '🌧️ Monsoon magic at {{business_name}}! ☔\n\nBeat the rains with our special {{offer}}. Perfect for those cozy rainy days! 🫖\n\n#MonsoonSpecial #RainyDay #{{city}}Food', hashtagTemplate: '#Monsoon #RainySeason #{{city}}', ctaTemplate: 'Order Now', platforms: ['instagram', 'facebook', 'whatsapp'], businessTypes: ['restaurant', 'cafe', 'tea-shop'], languages: ['english', 'hinglish'], tone: 'friendly', region: Region.PAN_INDIA, tags: ['monsoon', 'rain', 'seasonal'], keywords: ['monsoon', 'rain', 'rainy', 'season'] },
  { slug: 'gym-transformation', title: 'Fitness Transformation Story', category: TemplateCategory.ENGAGEMENT, subcategory: 'transformation', contentSkeleton: '💪 Transformation Tuesday at {{business_name}}!\n\nFrom Day 1 to Day {{days}} — see the amazing progress!\n\n🏋️ {{workout_type}}\n🥗 {{diet_plan}}\n📊 Results: {{results}}\n\nYour journey starts today! 🚀\n\n#TransformationTuesday #FitnessJourney #{{city}}Gym', hashtagTemplate: '#Fitness #Transformation #GymLife', ctaTemplate: 'Start Your Journey', platforms: ['instagram', 'facebook'], businessTypes: ['gym'], languages: ['english'], tone: 'professional', region: Region.PAN_INDIA, tags: ['fitness', 'transformation', 'gym'], keywords: ['transformation', 'fitness', 'gym', 'workout'] },
  { slug: 'navratri-special', title: 'Navratri Celebration', category: TemplateCategory.FESTIVAL, subcategory: 'navratri', contentSkeleton: '🔴🟠🟡 Happy Navratri from {{business_name}}! 🙏\n\nDay {{day_number}} — {{color_of_the_day}} color!\n\n{{special_offer_or_message}}\n\nJai Mata Di! 🙌\n\n#Navratri #Day{{day_number}} #{{city}}', hashtagTemplate: '#Navratri2025 #JaiMataDi #{{city}}Festival', ctaTemplate: 'Celebrate with us!', platforms: ['instagram', 'facebook', 'whatsapp'], businessTypes: ['restaurant', 'cafe', 'boutique', 'salon'], languages: ['english', 'hindi', 'hinglish'], tone: 'friendly', region: Region.PAN_INDIA, tags: ['navratri', 'festival', 'celebration'], keywords: ['navratri', 'garba', 'dandiya', 'festival'] },
  { slug: 'pongal-celebration', title: 'Pongal Festival Post', category: TemplateCategory.FESTIVAL, subcategory: 'pongal', contentSkeleton: '🌾 Happy Pongal from {{business_name}}! 🎉\n\nPongalo Pongal! Celebrate the harvest festival with us.\n\n{{special_offer}}\n\n#HappyPongal #{{city}} #TamilFestival', hashtagTemplate: '#Pongal #HarvestFestival #TamilNadu', ctaTemplate: 'Visit us!', platforms: ['instagram', 'facebook'], businessTypes: ['restaurant', 'cafe', 'salon', 'boutique'], languages: ['english'], tone: 'friendly', region: Region.SOUTH_INDIA, tags: ['pongal', 'harvest', 'tamil'], keywords: ['pongal', 'harvest', 'tamil', 'festival'] },
  { slug: 'baisakhi-celebration', title: 'Baisakhi Festival Post', category: TemplateCategory.FESTIVAL, subcategory: 'baisakhi', contentSkeleton: '🌾 Happy Baisakhi from {{business_name}}! 🎊\n\nCelebrate the harvest season with joy and prosperity!\n\n{{special_offer}}\n\n#HappyBaisakhi #PunjabiVibes #{{city}}', hashtagTemplate: '#Baisakhi #HarvestFestival #Punjab', ctaTemplate: 'Celebrate Now!', platforms: ['instagram', 'facebook', 'whatsapp'], businessTypes: ['restaurant', 'cafe', 'boutique', 'salon'], languages: ['english', 'hinglish'], tone: 'fun', region: Region.NORTH_INDIA, tags: ['baisakhi', 'harvest', 'punjab'], keywords: ['baisakhi', 'harvest', 'punjab', 'festival'] },
  { slug: 'salon-makeover', title: 'Before & After Makeover', category: TemplateCategory.ENGAGEMENT, subcategory: 'makeover', contentSkeleton: '✨ Before ➡️ After at {{business_name}}! 💇‍♀️\n\nOur expert {{stylist_name}} worked their magic!\n\n💈 Service: {{service_name}}\n💰 Starting at ₹{{price}}\n\nBook your transformation today! 📱\n\n#Makeover #{{city}}Salon #HairTransformation', hashtagTemplate: '#SalonMakeover #BeautyTransformation #{{city}}', ctaTemplate: 'Book Now', platforms: ['instagram', 'facebook'], businessTypes: ['salon'], languages: ['english'], tone: 'friendly', region: Region.PAN_INDIA, tags: ['salon', 'makeover', 'hair', 'beauty'], keywords: ['makeover', 'salon', 'hair', 'beauty'] },
  { slug: 'independence-day', title: 'Independence Day Post', category: TemplateCategory.FESTIVAL, subcategory: 'independence_day', contentSkeleton: '🇮🇳 Happy Independence Day! 🇮🇳\n\n{{business_name}} wishes everyone a proud and happy 15th August! 🎉\n\nJai Hind! 🙏\n\n#IndependenceDay #JaiHind #ProudIndian', hashtagTemplate: '#IndependenceDay #15August #JaiHind', ctaTemplate: '', platforms: ['instagram', 'facebook', 'whatsapp'], businessTypes: ['restaurant', 'cafe', 'salon', 'gym', 'clinic', 'boutique', 'kirana', 'tea-shop'], languages: ['english', 'hindi', 'hinglish'], tone: 'professional', region: Region.PAN_INDIA, tags: ['independence', 'national', 'patriotic'], keywords: ['independence day', '15 august', 'jai hind'] },
  { slug: 'clinic-health-tip', title: 'Daily Health Tip', category: TemplateCategory.ENGAGEMENT, subcategory: 'health_tip', contentSkeleton: '🩺 Health Tip from {{business_name}}:\n\n💡 {{health_tip}}\n\n{{explanation}}\n\nStay healthy, stay happy! 🌟\n\n#HealthTip #{{city}}Doctor #WellnessWednesday', hashtagTemplate: '#HealthTips #WellnessWednesday #StayHealthy', ctaTemplate: 'Book Consultation', platforms: ['instagram', 'facebook'], businessTypes: ['clinic'], languages: ['english', 'hinglish'], tone: 'professional', region: Region.PAN_INDIA, tags: ['health', 'wellness', 'tip', 'medical'], keywords: ['health', 'tip', 'wellness', 'doctor'] },
];

// ─── Insight Templates ──────────────────────────────────────────────────────────

export const SEED_INSIGHTS: Partial<InsightTemplate>[] = [
  { category: InsightCategory.PERFORMANCE, templateText: 'Your {{best_day}} posts get {{x_times}}x more engagement. Post your next offer on {{next_best_day}}!', tone: InsightTone.ENCOURAGING, triggerCondition: 'best_day_detected', languages: ['english', 'hinglish'], priority: 9, isNotificationWorthy: true },
  { category: InsightCategory.PERFORMANCE, templateText: 'Hinglish captions are crushing it — {{pct}}% more likes than English-only 🔥', tone: InsightTone.PLAYFUL, triggerCondition: 'hinglish_outperforms', languages: ['english', 'hinglish'], priority: 8, isNotificationWorthy: true },
  { category: InsightCategory.STREAK, templateText: "You haven't posted in {{days}} days. Your competitor {{competitor_type}} posted {{their_count}} times!", tone: InsightTone.URGENT, triggerCondition: 'days_since_post > 3', languages: ['english'], priority: 10, isNotificationWorthy: true },
  { category: InsightCategory.TREND, templateText: 'Festival alert: {{festival_name}} is in {{days}} days. Your {{business_type}} audience loves festive content 🎉', tone: InsightTone.ENCOURAGING, triggerCondition: 'festival_upcoming', languages: ['english', 'hinglish'], priority: 9, isNotificationWorthy: true },
  { category: InsightCategory.STREAK, templateText: "Hot streak: {{streak_count}} days posting! You're in the top {{percentile}}% of {{business_type}} owners 🔥", tone: InsightTone.PLAYFUL, triggerCondition: 'streak >= 7', languages: ['english', 'hinglish'], priority: 8, isNotificationWorthy: true },
  { category: InsightCategory.TIMING, templateText: 'Your audience is most active at {{best_time}}. Schedule your next post then for max reach! ⏰', tone: InsightTone.ANALYTICAL, triggerCondition: 'best_time_detected', languages: ['english'], priority: 7, isNotificationWorthy: false },
  { category: InsightCategory.CONTENT_TYPE, templateText: '{{top_goal}} posts perform {{pct}}% better than others. Double down on what works! 💪', tone: InsightTone.ENCOURAGING, triggerCondition: 'top_goal_detected', languages: ['english'], priority: 7, isNotificationWorthy: false },
  { category: InsightCategory.AUDIENCE, templateText: 'Your Instagram audience grew by {{growth}}% this week. Keep the momentum! 📈', tone: InsightTone.ENCOURAGING, triggerCondition: 'instagram_growth > 5', languages: ['english'], priority: 6, isNotificationWorthy: true },
  { category: InsightCategory.MILESTONE, templateText: '🎉 Milestone unlocked! You\'ve created {{count}} posts with BusinessPro. You\'re on fire!', tone: InsightTone.PLAYFUL, triggerCondition: 'total_posts_milestone', languages: ['english', 'hinglish'], priority: 8, isNotificationWorthy: true },
  { category: InsightCategory.PERFORMANCE, templateText: 'Posts with emojis get {{pct}}% more engagement. Try adding more next time! 😊', tone: InsightTone.ANALYTICAL, triggerCondition: 'emoji_impact_positive', languages: ['english'], priority: 5, isNotificationWorthy: false },
  { category: InsightCategory.TIMING, templateText: 'Weekend posts get {{pct}}% more reach than weekday posts for your {{business_type}} 📊', tone: InsightTone.ANALYTICAL, triggerCondition: 'weekend_outperforms', languages: ['english'], priority: 6, isNotificationWorthy: false },
  { category: InsightCategory.CONTENT_TYPE, templateText: 'Festival posts are your top performers! {{festival_name}} is coming — ready to create? 🎊', tone: InsightTone.ENCOURAGING, triggerCondition: 'festival_posts_top', languages: ['english', 'hinglish'], priority: 8, isNotificationWorthy: true },
  { category: InsightCategory.STREAK, templateText: 'You posted every day this week! 7-day streak 🔥 Keep going for the "Consistency King" badge!', tone: InsightTone.PLAYFUL, triggerCondition: 'streak == 7', languages: ['english'], priority: 9, isNotificationWorthy: true },
  { category: InsightCategory.PERFORMANCE, templateText: 'Short captions (under 100 chars) got {{pct}}% more likes. Less is more! ✨', tone: InsightTone.ANALYTICAL, triggerCondition: 'short_captions_win', languages: ['english'], priority: 5, isNotificationWorthy: false },
  { category: InsightCategory.AUDIENCE, templateText: 'Your Facebook engagement dropped {{pct}}% this week. Try posting a customer story! 📖', tone: InsightTone.URGENT, triggerCondition: 'fb_engagement_drop', languages: ['english'], priority: 7, isNotificationWorthy: true },
  { category: InsightCategory.MILESTONE, templateText: 'You\'ve responded to {{count}} reviews! Your online reputation is getting stronger 💪', tone: InsightTone.ENCOURAGING, triggerCondition: 'reviews_responded_milestone', languages: ['english'], priority: 6, isNotificationWorthy: false },
  { category: InsightCategory.TREND, templateText: '{{trending_topic}} is trending in your area! Create a post about it to ride the wave 🌊', tone: InsightTone.ENCOURAGING, triggerCondition: 'local_trend_detected', languages: ['english', 'hinglish'], priority: 9, isNotificationWorthy: true },
  { category: InsightCategory.PERFORMANCE, templateText: 'Google Business posts drove {{count}} profile visits this month. Keep posting there! 📍', tone: InsightTone.ANALYTICAL, triggerCondition: 'gbp_visits_up', languages: ['english'], priority: 6, isNotificationWorthy: false },
  { category: InsightCategory.STREAK, templateText: 'Your longest streak is {{longest}} days. Can you beat it? Current: {{current}} days 🎯', tone: InsightTone.PLAYFUL, triggerCondition: 'streak_challenge', languages: ['english'], priority: 5, isNotificationWorthy: false },
  { category: InsightCategory.CONTENT_TYPE, templateText: 'Promotional posts are {{pct}}% of your content. Mix in some engagement posts for balance! 🎯', tone: InsightTone.ANALYTICAL, triggerCondition: 'content_imbalance', languages: ['english'], priority: 5, isNotificationWorthy: false },
];

// ─── Festivals ──────────────────────────────────────────────────────────────────

export const SEED_FESTIVALS: Partial<Festival>[] = [
  { name: 'Republic Day', slug: 'republic-day', dateStart: new Date('2026-01-26'), type: FestivalType.NATIONAL, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'gym', 'clinic', 'boutique', 'kirana', 'tea-shop'], themes: ['patriotic', 'national'], keywords: ['republic day', '26 january', 'constitution'], colors: ['#FF9933', '#FFFFFF', '#138808'], description: 'Celebrates the adoption of the Indian Constitution', recurringRule: 'yearly' },
  { name: 'Independence Day', slug: 'independence-day', dateStart: new Date('2026-08-15'), type: FestivalType.NATIONAL, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'gym', 'clinic', 'boutique', 'kirana', 'tea-shop'], themes: ['patriotic', 'freedom'], keywords: ['independence day', '15 august', 'jai hind'], colors: ['#FF9933', '#FFFFFF', '#138808'], description: 'Celebrates India\'s independence from British rule', recurringRule: 'yearly' },
  { name: 'Gandhi Jayanti', slug: 'gandhi-jayanti', dateStart: new Date('2026-10-02'), type: FestivalType.NATIONAL, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'gym', 'clinic', 'boutique', 'kirana'], themes: ['peace', 'non-violence'], keywords: ['gandhi jayanti', '2 october', 'mahatma'], colors: ['#FFFFFF', '#4CAF50'], recurringRule: 'yearly' },
  { name: 'Diwali', slug: 'diwali-2026', dateStart: new Date('2026-10-20'), dateEnd: new Date('2026-10-24'), type: FestivalType.RELIGIOUS, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'gym', 'boutique', 'kirana', 'tea-shop'], themes: ['lights', 'prosperity', 'celebration'], keywords: ['diwali', 'deepavali', 'festival of lights', 'lakshmi puja'], colors: ['#FFD700', '#FF6F00', '#E91E63'], description: 'Festival of Lights', recurringRule: 'yearly' },
  { name: 'Holi', slug: 'holi-2026', dateStart: new Date('2026-03-17'), type: FestivalType.RELIGIOUS, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'boutique', 'kirana', 'tea-shop'], themes: ['colors', 'joy', 'celebration'], keywords: ['holi', 'rang', 'festival of colors', 'gulaal'], colors: ['#E91E63', '#9C27B0', '#2196F3', '#4CAF50', '#FF9800'], description: 'Festival of Colors', recurringRule: 'yearly' },
  { name: 'Eid ul-Fitr', slug: 'eid-ul-fitr-2026', dateStart: new Date('2026-03-20'), type: FestivalType.RELIGIOUS, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'boutique', 'salon', 'kirana'], themes: ['celebration', 'togetherness', 'feast'], keywords: ['eid', 'eid mubarak', 'ramadan', 'iftar'], colors: ['#4CAF50', '#FFD700', '#FFFFFF'], description: 'Celebration marking the end of Ramadan', recurringRule: 'yearly' },
  { name: 'Christmas', slug: 'christmas-2026', dateStart: new Date('2026-12-25'), type: FestivalType.RELIGIOUS, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'boutique', 'gym'], themes: ['joy', 'giving', 'celebration'], keywords: ['christmas', 'merry christmas', 'xmas', 'santa'], colors: ['#D32F2F', '#388E3C', '#FFD700', '#FFFFFF'], description: 'Christmas Day celebration', recurringRule: 'yearly' },
  { name: 'Pongal', slug: 'pongal-2026', dateStart: new Date('2026-01-14'), dateEnd: new Date('2026-01-17'), type: FestivalType.REGIONAL, regions: ['south_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'boutique'], themes: ['harvest', 'tradition', 'thanksgiving'], keywords: ['pongal', 'thai pongal', 'harvest festival', 'tamil'], colors: ['#FF9800', '#795548', '#4CAF50'], description: 'Tamil harvest festival', recurringRule: 'yearly' },
  { name: 'Onam', slug: 'onam-2026', dateStart: new Date('2026-09-01'), dateEnd: new Date('2026-09-11'), type: FestivalType.REGIONAL, regions: ['south_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'boutique'], themes: ['harvest', 'tradition', 'feast'], keywords: ['onam', 'kerala', 'sadya', 'maveli'], colors: ['#FFD700', '#4CAF50', '#FF5722'], description: 'Kerala harvest festival', recurringRule: 'yearly' },
  { name: 'Navratri', slug: 'navratri-2026', dateStart: new Date('2026-10-10'), dateEnd: new Date('2026-10-18'), type: FestivalType.RELIGIOUS, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'boutique', 'gym'], themes: ['devotion', 'dance', 'celebration'], keywords: ['navratri', 'garba', 'dandiya', 'durga'], colors: ['#E91E63', '#FF9800', '#FFD700', '#4CAF50', '#2196F3'], description: 'Nine nights of devotion to Goddess Durga', recurringRule: 'yearly' },
  { name: 'Durga Puja', slug: 'durga-puja-2026', dateStart: new Date('2026-10-14'), dateEnd: new Date('2026-10-19'), type: FestivalType.REGIONAL, regions: ['east_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'boutique'], themes: ['worship', 'celebration', 'art'], keywords: ['durga puja', 'bengal', 'pandal', 'dashami'], colors: ['#E91E63', '#FFD700', '#F44336'], description: 'Major festival of Bengal celebrating Goddess Durga', recurringRule: 'yearly' },
  { name: 'Ganesh Chaturthi', slug: 'ganesh-chaturthi-2026', dateStart: new Date('2026-08-27'), dateEnd: new Date('2026-09-06'), type: FestivalType.RELIGIOUS, regions: ['west_india', 'pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'boutique', 'kirana'], themes: ['devotion', 'celebration', 'community'], keywords: ['ganesh chaturthi', 'ganapati', 'ganpati bappa', 'modak'], colors: ['#FF9800', '#E91E63', '#FFD700'], description: 'Celebrating the birth of Lord Ganesha', recurringRule: 'yearly' },
  { name: 'Baisakhi', slug: 'baisakhi-2026', dateStart: new Date('2026-04-13'), type: FestivalType.REGIONAL, regions: ['north_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'gym', 'salon', 'boutique'], themes: ['harvest', 'new year', 'celebration'], keywords: ['baisakhi', 'punjab', 'bhangra', 'harvest'], colors: ['#FF9800', '#FFD700', '#4CAF50'], description: 'Punjabi harvest and New Year festival', recurringRule: 'yearly' },
  { name: 'Raksha Bandhan', slug: 'raksha-bandhan-2026', dateStart: new Date('2026-08-11'), type: FestivalType.RELIGIOUS, regions: ['pan_india'], relevantBusinessTypes: ['boutique', 'salon', 'restaurant', 'cafe', 'kirana'], themes: ['siblings', 'love', 'protection'], keywords: ['raksha bandhan', 'rakhi', 'brother sister', 'bond'], colors: ['#E91E63', '#FFD700', '#9C27B0'], description: 'Festival celebrating the bond between siblings', recurringRule: 'yearly' },
  { name: 'Makar Sankranti', slug: 'makar-sankranti-2026', dateStart: new Date('2026-01-14'), type: FestivalType.RELIGIOUS, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'kirana', 'tea-shop'], themes: ['harvest', 'kite', 'transition'], keywords: ['makar sankranti', 'uttarayan', 'kite festival', 'til gul'], colors: ['#FF9800', '#2196F3', '#FFD700'], description: 'Harvest festival marking the sun\'s transition', recurringRule: 'yearly' },
  { name: "Valentine's Day", slug: 'valentines-day-2026', dateStart: new Date('2026-02-14'), type: FestivalType.COMMERCIAL, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'boutique'], themes: ['love', 'romance', 'gifts'], keywords: ['valentine', 'love', 'couple', 'date'], colors: ['#E91E63', '#F44336', '#FFFFFF'], description: 'Day of love and romance', recurringRule: 'yearly' },
  { name: "Mother's Day", slug: 'mothers-day-2026', dateStart: new Date('2026-05-10'), type: FestivalType.COMMERCIAL, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'boutique'], themes: ['gratitude', 'love', 'family'], keywords: ['mothers day', 'mom', 'mother', 'gratitude'], colors: ['#E91E63', '#FFFFFF', '#FFD700'], recurringRule: 'yearly' },
  { name: "New Year's Day", slug: 'new-year-2026', dateStart: new Date('2026-01-01'), type: FestivalType.COMMERCIAL, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'gym', 'boutique', 'clinic'], themes: ['celebration', 'new beginnings'], keywords: ['new year', 'happy new year', '2026', 'celebration'], colors: ['#FFD700', '#9C27B0', '#2196F3'], description: 'New Year celebration', recurringRule: 'yearly' },
  { name: 'Monsoon Season', slug: 'monsoon-2026', dateStart: new Date('2026-06-15'), dateEnd: new Date('2026-09-15'), type: FestivalType.SEASONAL, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'tea-shop'], themes: ['rain', 'cozy', 'warm food'], keywords: ['monsoon', 'rain', 'rainy season', 'chai'], colors: ['#607D8B', '#2196F3', '#4CAF50'], description: 'Indian monsoon season', recurringRule: 'yearly' },
  { name: 'Summer Season', slug: 'summer-2026', dateStart: new Date('2026-04-01'), dateEnd: new Date('2026-06-15'), type: FestivalType.SEASONAL, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'gym', 'salon', 'clinic'], themes: ['heat', 'refreshment', 'vacation'], keywords: ['summer', 'heat', 'cool', 'refreshing'], colors: ['#FF9800', '#FFEB3B', '#2196F3'], recurringRule: 'yearly' },
  { name: 'Lohri', slug: 'lohri-2026', dateStart: new Date('2026-01-13'), type: FestivalType.REGIONAL, regions: ['north_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'kirana', 'tea-shop'], themes: ['bonfire', 'harvest', 'winter'], keywords: ['lohri', 'bonfire', 'punjab', 'winter'], colors: ['#FF5722', '#FF9800', '#FFD700'], description: 'Punjabi winter bonfire festival', recurringRule: 'yearly' },
  { name: 'Ugadi', slug: 'ugadi-2026', dateStart: new Date('2026-03-28'), type: FestivalType.REGIONAL, regions: ['south_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'boutique'], themes: ['new year', 'tradition'], keywords: ['ugadi', 'telugu new year', 'kannada new year'], colors: ['#FFD700', '#4CAF50', '#FF9800'], description: 'Telugu/Kannada New Year', recurringRule: 'yearly' },
  { name: 'Bihu', slug: 'bihu-2026', dateStart: new Date('2026-04-14'), type: FestivalType.REGIONAL, regions: ['east_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'salon', 'boutique'], themes: ['harvest', 'dance', 'tradition'], keywords: ['bihu', 'assam', 'harvest', 'rongali'], colors: ['#4CAF50', '#FF9800', '#E91E63'], description: 'Assamese harvest festival', recurringRule: 'yearly' },
  { name: 'Chhath Puja', slug: 'chhath-puja-2026', dateStart: new Date('2026-10-25'), dateEnd: new Date('2026-10-28'), type: FestivalType.REGIONAL, regions: ['east_india', 'north_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'kirana'], themes: ['sun worship', 'devotion', 'tradition'], keywords: ['chhath', 'surya', 'sun worship', 'bihar'], colors: ['#FF9800', '#FFD700', '#F44336'], description: 'Ancient Hindu festival dedicated to Sun God', recurringRule: 'yearly' },
  { name: 'Janmashtami', slug: 'janmashtami-2026', dateStart: new Date('2026-08-14'), type: FestivalType.RELIGIOUS, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'boutique', 'kirana'], themes: ['devotion', 'celebration', 'midnight'], keywords: ['janmashtami', 'krishna', 'dahi handi', 'midnight'], colors: ['#1A237E', '#FFD700', '#E91E63'], description: 'Birthday of Lord Krishna', recurringRule: 'yearly' },
  { name: 'World Health Day', slug: 'world-health-day-2026', dateStart: new Date('2026-04-07'), type: FestivalType.COMMERCIAL, regions: ['pan_india'], relevantBusinessTypes: ['gym', 'clinic'], themes: ['health', 'wellness', 'fitness'], keywords: ['health day', 'wellness', 'fitness', 'healthy'], colors: ['#4CAF50', '#2196F3', '#FFFFFF'], recurringRule: 'yearly' },
  { name: 'National Pizza Day', slug: 'national-pizza-day-2026', dateStart: new Date('2026-02-09'), type: FestivalType.COMMERCIAL, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe'], themes: ['food', 'pizza', 'fun'], keywords: ['pizza day', 'pizza', 'food', 'celebrate'], colors: ['#F44336', '#FFD700', '#4CAF50'], recurringRule: 'yearly' },
  { name: 'Eid ul-Adha', slug: 'eid-ul-adha-2026', dateStart: new Date('2026-05-27'), type: FestivalType.RELIGIOUS, regions: ['pan_india'], relevantBusinessTypes: ['restaurant', 'cafe', 'boutique', 'salon', 'kirana'], themes: ['sacrifice', 'celebration', 'feast'], keywords: ['eid ul adha', 'bakrid', 'qurbani'], colors: ['#4CAF50', '#FFD700', '#FFFFFF'], description: 'Festival of sacrifice', recurringRule: 'yearly' },
];
