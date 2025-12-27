'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Locale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons' | 'compact';
  showLabel?: boolean;
  className?: string;
}

export function LanguageSwitcher({
  variant = 'dropdown',
  showLabel = true,
  className = '',
}: LanguageSwitcherProps) {
  const { locale, localeInfo, availableLocales, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  // Compact variant - just flag buttons
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {availableLocales.map((loc) => (
          <button
            key={loc.code}
            onClick={() => handleLocaleChange(loc.code)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
              locale === loc.code
                ? 'bg-indigo-100 ring-2 ring-indigo-500'
                : 'hover:bg-gray-100'
            }`}
            title={loc.nativeName}
          >
            <span className="text-lg">{loc.flag}</span>
          </button>
        ))}
      </div>
    );
  }

  // Buttons variant - horizontal button group
  if (variant === 'buttons') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showLabel && (
          <span className="text-sm text-gray-500 mr-1">{t('settings.language')}:</span>
        )}
        <div className="flex items-center border rounded-lg overflow-hidden">
          {availableLocales.map((loc, index) => (
            <button
              key={loc.code}
              onClick={() => handleLocaleChange(loc.code)}
              className={`px-3 py-2 flex items-center gap-2 transition-colors ${
                locale === loc.code
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } ${index > 0 ? 'border-l' : ''}`}
            >
              <span>{loc.flag}</span>
              <span className="text-sm font-medium">{loc.code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Dropdown variant (default)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {showLabel && (
        <label className="block text-sm text-gray-500 mb-1">{t('settings.language')}</label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors min-w-[160px]"
      >
        <span className="text-lg">{localeInfo.flag}</span>
        <span className="flex-1 text-left text-sm font-medium">{localeInfo.nativeName}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg overflow-hidden">
          {availableLocales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => handleLocaleChange(loc.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                locale === loc.code ? 'bg-indigo-50' : ''
              }`}
            >
              <span className="text-lg">{loc.flag}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{loc.nativeName}</div>
                <div className="text-xs text-gray-500">{loc.name}</div>
              </div>
              {locale === loc.code && (
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
