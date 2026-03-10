import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enDashboard from './locales/en/dashboard.json';
import enCreate from './locales/en/create.json';
import enSettings from './locales/en/settings.json';
import enNotifications from './locales/en/notifications.json';

import hiCommon from './locales/hi/common.json';
import hiDashboard from './locales/hi/dashboard.json';
import hiCreate from './locales/hi/create.json';
import hiSettings from './locales/hi/settings.json';
import hiNotifications from './locales/hi/notifications.json';

export const SUPPORTED_LANGUAGES = ['en', 'hi'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'हिन्दी',
};

const resources = {
  en: {
    common: enCommon,
    dashboard: enDashboard,
    create: enCreate,
    settings: enSettings,
    notifications: enNotifications,
  },
  hi: {
    common: hiCommon,
    dashboard: hiDashboard,
    create: hiCreate,
    settings: hiSettings,
    notifications: hiNotifications,
  },
};

export function initI18n(language: SupportedLanguage = 'en') {
  return i18next.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'en',
    ns: ['common', 'dashboard', 'create', 'settings', 'notifications'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });
}

export { i18next };
export { useTranslation } from 'react-i18next';
