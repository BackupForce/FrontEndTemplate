// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 載入模組化語系 JSON
import user_en from '../../locales/en/user.json';
import common_en from '../../locales/en/common.json';

import user_zh from '../../locales/zh-TW/user.json';
import common_zh from '../../locales/zh-TW/common.json';

import company_zh from '../../locales/zh-TW/company.json';
import partner_zh from '../../locales/zh-TW/partner.json';

import receivable_zh from '../../locales/zh-TW/receivable.json';
import payable_zh from '../../locales/zh-TW/payable.json';
import income_zh from '../../locales/zh-TW/income-entry.json';
import errorZh from "../../locales/zh-TW/error.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        user: user_en,
        common: common_en,
      },
      'zh-TW': {
        user: user_zh,
        common: common_zh,
        error: errorZh,
        company: company_zh,
        partner: partner_zh,
        receivable: receivable_zh,
        payable: payable_zh,
        income: income_zh,
        
      },
    },
    lng: 'zh-TW', // 預設語言
    fallbackLng: 'en',
    ns: ['common', 'user', 'company', 'partner', 'receivable', 'payable', 'income', 'error' ], // 註冊 namespace
    defaultNS: 'common',    // 預設 namespace
    interpolation: {
      escapeValue: false, // React 已自動處理 XSS
    },
  });

export default i18n;

export const languageItems = [
  { key: 'zh-TW', label: '繁體中文' },
  { key: 'en', label: 'English' },
];

export const handleLanguageChange = ({ key }: { key: string }) => {
  i18n.changeLanguage(key);
};
