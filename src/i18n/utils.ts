// src/i18n/utils.ts
import en from './en.json';
import es from './es.json';

export const languages = {
  en: 'English',
  es: 'Español',
};

export const defaultLang = 'es';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof languages) {
  return function t(key: string) {
    const langData = lang === 'en' ? en : es;
    // Simple deep access support (e.g. 'site.title')
    return key.split('.').reduce((o, i) => o ? o[i] : null, langData) || key;
  }
}
