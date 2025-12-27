import { en, ja, vi } from './locales';
import type { Locale, Translations, LocaleInfo } from './types';
import { LOCALES, DEFAULT_LOCALE } from './types';

// All translations
const translations: Record<Locale, Translations> = {
  en,
  ja,
  vi,
};

// Storage key for locale preference
const LOCALE_STORAGE_KEY = 'optichain_locale';

/**
 * Get the current locale from localStorage or browser preference
 */
export function getLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  // Try to get from localStorage
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && isValidLocale(stored)) {
    return stored as Locale;
  }

  // Try to get from browser preference
  const browserLang = navigator.language.split('-')[0];
  if (isValidLocale(browserLang)) {
    return browserLang as Locale;
  }

  return DEFAULT_LOCALE;
}

/**
 * Set the current locale and save to localStorage
 */
export function setLocale(locale: Locale): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    // Update HTML lang attribute
    document.documentElement.lang = locale;
    // Trigger a custom event for components to react
    window.dispatchEvent(new CustomEvent('localechange', { detail: { locale } }));
  }
}

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locale in translations;
}

/**
 * Get translations for a specific locale
 */
export function getTranslations(locale?: Locale): Translations {
  const currentLocale = locale || getLocale();
  return translations[currentLocale] || translations[DEFAULT_LOCALE];
}

/**
 * Get a specific translation by path (e.g., 'common.loading')
 */
export function t(path: string, locale?: Locale, params?: Record<string, string | number>): string {
  const trans = getTranslations(locale);
  const keys = path.split('.');

  // Navigate to the translation
  let result: unknown = trans;
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      console.warn(`Translation not found: ${path}`);
      return path;
    }
  }

  if (typeof result !== 'string') {
    console.warn(`Translation is not a string: ${path}`);
    return path;
  }

  // Replace parameters
  if (params) {
    return Object.entries(params).reduce((str, [key, value]) => {
      return str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    }, result);
  }

  return result;
}

/**
 * Get all available locales
 */
export function getAvailableLocales(): LocaleInfo[] {
  return Object.values(LOCALES);
}

/**
 * Get locale info for a specific locale
 */
export function getLocaleInfo(locale: Locale): LocaleInfo {
  return LOCALES[locale];
}

/**
 * Format a date according to the current locale
 */
export function formatDate(date: Date | string, locale?: Locale): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const currentLocale = locale || getLocale();

  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    ja: 'ja-JP',
    vi: 'vi-VN',
  };

  return d.toLocaleDateString(localeMap[currentLocale], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Format a time according to the current locale
 */
export function formatTime(date: Date | string, locale?: Locale): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const currentLocale = locale || getLocale();

  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    ja: 'ja-JP',
    vi: 'vi-VN',
  };

  return d.toLocaleTimeString(localeMap[currentLocale], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a date and time according to the current locale
 */
export function formatDateTime(date: Date | string, locale?: Locale): string {
  return `${formatDate(date, locale)} ${formatTime(date, locale)}`;
}

/**
 * Get day names for the current locale
 */
export function getDayNames(locale?: Locale, short: boolean = false): string[] {
  const trans = getTranslations(locale);
  if (short) {
    return [
      trans.schedule.mondayShort,
      trans.schedule.tuesdayShort,
      trans.schedule.wednesdayShort,
      trans.schedule.thursdayShort,
      trans.schedule.fridayShort,
      trans.schedule.saturdayShort,
      trans.schedule.sundayShort,
    ];
  }
  return [
    trans.schedule.monday,
    trans.schedule.tuesday,
    trans.schedule.wednesday,
    trans.schedule.thursday,
    trans.schedule.friday,
    trans.schedule.saturday,
    trans.schedule.sunday,
  ];
}

// Re-export types and constants
export { LOCALES, DEFAULT_LOCALE };
export type { Locale, Translations, LocaleInfo };
