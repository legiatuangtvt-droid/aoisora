'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/Toast';
import { Language } from '@/types/layout';

interface UserMenuProps {
  onClose: () => void;
}

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'vi-VN', label: 'Tieng Viet', flag: '🇻🇳' },
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', label: '日本語', flag: '🇯🇵' },
];

export default function UserMenu({ onClose }: UserMenuProps) {
  const { setTheme, isDark } = useTheme();
  const { showDevelopingToast } = useToast();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('vi-VN');

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleLanguageSelect = (lang: Language) => {
    setCurrentLanguage(lang);
    setShowLanguageMenu(false);
    localStorage.setItem('language', lang);
  };

  const getCurrentLanguageLabel = () => {
    return languages.find(l => l.code === currentLanguage)?.label || 'Tieng Viet';
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
      {/* Dark Mode Toggle */}
      <button
        onClick={handleThemeToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isDark ? (
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
        </div>
        {/* Toggle Switch */}
        <div className={`w-10 h-5 rounded-full transition-colors ${isDark ? 'bg-[#C5055B]' : 'bg-gray-300'}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform mt-0.5 ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
      </button>

      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* My Profile */}
      <button
        onClick={() => {
          showDevelopingToast();
          onClose();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-sm text-gray-700 dark:text-gray-300">My Profile</span>
      </button>

      {/* Account Settings */}
      <button
        onClick={() => {
          showDevelopingToast();
          onClose();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm text-gray-700 dark:text-gray-300">Account Settings</span>
      </button>

      {/* Language */}
      <div className="relative">
        <button
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-700 dark:text-gray-300">Language</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{getCurrentLanguageLabel()}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Language Submenu */}
        {showLanguageMenu && (
          <div className="bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-6 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  currentLanguage === lang.code ? 'bg-pink-50 dark:bg-pink-900/20' : ''
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span className={`text-sm ${currentLanguage === lang.code ? 'text-[#C5055B] font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                  {lang.label}
                </span>
                {currentLanguage === lang.code && (
                  <svg className="w-4 h-4 text-[#C5055B] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Help / Support */}
      <button
        onClick={() => {
          showDevelopingToast();
          onClose();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm text-gray-700 dark:text-gray-300">Help / Support</span>
      </button>

      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* Logout */}
      <button
        onClick={() => {
          showDevelopingToast();
          onClose();
        }}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  );
}
