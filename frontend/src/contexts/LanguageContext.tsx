'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Locale,
  Translations,
  LocaleInfo,
  getLocale,
  setLocale as setStoredLocale,
  getTranslations,
  getAvailableLocales,
  getLocaleInfo,
  t as translate,
  formatDate as formatDateFn,
  formatTime as formatTimeFn,
  formatDateTime as formatDateTimeFn,
  getDayNames as getDayNamesFn,
  DEFAULT_LOCALE,
} from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  translations: Translations;
  localeInfo: LocaleInfo;
  availableLocales: LocaleInfo[];
  setLocale: (locale: Locale) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  formatDate: (date: Date | string) => string;
  formatTime: (date: Date | string) => string;
  formatDateTime: (date: Date | string) => string;
  getDayNames: (short?: boolean) => string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || DEFAULT_LOCALE);
  const [translations, setTranslations] = useState<Translations>(getTranslations(initialLocale || DEFAULT_LOCALE));
  const [mounted, setMounted] = useState(false);

  // Initialize locale on mount
  useEffect(() => {
    const savedLocale = getLocale();
    setLocaleState(savedLocale);
    setTranslations(getTranslations(savedLocale));
    document.documentElement.lang = savedLocale;
    setMounted(true);
  }, []);

  // Listen for locale changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'optichain_locale' && e.newValue) {
        const newLocale = e.newValue as Locale;
        setLocaleState(newLocale);
        setTranslations(getTranslations(newLocale));
        document.documentElement.lang = newLocale;
      }
    };

    const handleLocaleChange = (e: CustomEvent<{ locale: Locale }>) => {
      setLocaleState(e.detail.locale);
      setTranslations(getTranslations(e.detail.locale));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localechange', handleLocaleChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localechange', handleLocaleChange as EventListener);
    };
  }, []);

  // Set locale function
  const setLocale = useCallback((newLocale: Locale) => {
    setStoredLocale(newLocale);
    setLocaleState(newLocale);
    setTranslations(getTranslations(newLocale));
  }, []);

  // Translation function
  const t = useCallback(
    (path: string, params?: Record<string, string | number>) => {
      return translate(path, locale, params);
    },
    [locale]
  );

  // Date formatting
  const formatDate = useCallback(
    (date: Date | string) => formatDateFn(date, locale),
    [locale]
  );

  const formatTime = useCallback(
    (date: Date | string) => formatTimeFn(date, locale),
    [locale]
  );

  const formatDateTime = useCallback(
    (date: Date | string) => formatDateTimeFn(date, locale),
    [locale]
  );

  const getDayNames = useCallback(
    (short: boolean = false) => getDayNamesFn(locale, short),
    [locale]
  );

  // Get current locale info
  const localeInfo = getLocaleInfo(locale);
  const availableLocales = getAvailableLocales();

  const value: LanguageContextType = {
    locale,
    translations,
    localeInfo,
    availableLocales,
    setLocale,
    t,
    formatDate,
    formatTime,
    formatDateTime,
    getDayNames,
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <LanguageContext.Provider value={value}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to use the language context
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Hook to get translations directly
 */
export function useTranslations(): Translations {
  const { translations } = useLanguage();
  return translations;
}

/**
 * Hook to get the translation function
 */
export function useT(): (path: string, params?: Record<string, string | number>) => string {
  const { t } = useLanguage();
  return t;
}

export default LanguageContext;
