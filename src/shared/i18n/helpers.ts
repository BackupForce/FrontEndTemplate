import i18n from './index';

const translate = (key: string, options?: Record<string, unknown>): string => {
  return i18n.t(key, options);
};

export const tCommon = (key: string, options?: Record<string, unknown>): string => {
  return translate(`common:${key}`, options);
};

export const tAuth = (key: string, options?: Record<string, unknown>): string => {
  return translate(`auth:${key}`, options);
};
