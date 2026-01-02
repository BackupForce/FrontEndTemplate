import zhTW from "antd/es/locale/zh_TW";
import enUS from "antd/es/locale/en_US";

export const antdLocales = {
  "zh-TW": zhTW,
  en: enUS,
};

export type SupportedLocale = keyof typeof antdLocales;