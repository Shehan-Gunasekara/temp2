import de from "./locales/de";
import en from "./locales/en";

const translations = {
  en,
  de,
};

export type AvailableLanguages = keyof typeof translations;

const getTranslationByKey = (obj: any, key: string): string => {
  return key.split(".").reduce((o, i) => (o ? o[i] : key), obj) || key;
};

const getTranslation = (language: AvailableLanguages, key: any): string => {
  return getTranslationByKey(translations[language], key);
};

export { getTranslation, translations };
