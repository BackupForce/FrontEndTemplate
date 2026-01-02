import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from '@/locales/en/common.json';
import enAuth from '@/locales/en/auth.json';
import zhCommon from '@/locales/zh-TW/common.json';
import zhAuth from '@/locales/zh-TW/auth.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth
  },
  'zh-TW': {
    common: zhCommon,
    auth: zhAuth
  }
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh-TW'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    }
  })
  .catch((error) => {
    console.error('Failed to initialize i18n', error);
  });

export default i18n;
