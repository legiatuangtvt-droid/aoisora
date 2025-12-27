'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Simple API functions
async function checkHealth() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const response = await fetch(API_URL.replace('/api/v1', '/health'));
  return await response.json();
}

export default function Home() {
  const { translations: t } = useLanguage();
  const [backendStatus, setBackendStatus] = useState<{ version?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const health = await checkHealth();
        setBackendStatus(health);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with Language Switcher */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t.common.appName}</h1>
            <p className="text-xl text-gray-600">{t.common.appDescription}</p>
          </div>
          <LanguageSwitcher variant="compact" />
        </div>

        {/* Backend Status */}
        <div className={`p-4 rounded-xl border-2 mb-8 ${backendStatus ? 'bg-green-50 border-green-300' : loading ? 'bg-yellow-50 border-yellow-300' : 'bg-red-50 border-red-300'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${backendStatus ? 'bg-green-500' : loading ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="font-medium">
              Backend: {backendStatus ? t.backend.connected : loading ? t.backend.connecting : t.backend.disconnected}
              {backendStatus && <span className="text-gray-500 ml-2">v{backendStatus.version}</span>}
            </span>
          </div>
        </div>

        {/* DWS Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">{t.dws.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dws/daily-schedule" className="block p-6 border-2 rounded-xl bg-white hover:border-indigo-400 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{t.dws.dailySchedule}</h3>
                  <p className="text-sm text-gray-500">Daily Schedule</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{t.dws.dailyScheduleDesc}</p>
            </Link>

            <Link href="/dws/workforce-dispatch" className="block p-6 border-2 rounded-xl bg-white hover:border-indigo-400 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{t.dws.workforceDispatch}</h3>
                  <p className="text-sm text-gray-500">Workforce Dispatch</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{t.dws.workforceDispatchDesc}</p>
            </Link>

            <Link href="/dws/shift-codes" className="block p-6 border-2 rounded-xl bg-white hover:border-indigo-400 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{t.dws.shiftCodes}</h3>
                  <p className="text-sm text-gray-500">Shift Codes</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{t.dws.shiftCodesDesc}</p>
            </Link>
          </div>
        </div>

        {/* WS Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-teal-700">{t.ws.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/tasks" className="block p-6 border-2 rounded-xl bg-white hover:border-teal-400 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{t.ws.taskManagement}</h3>
                  <p className="text-sm text-gray-500">Task Management</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{t.ws.taskManagementDesc}</p>
            </Link>

            <div className="p-6 border-2 border-dashed rounded-xl bg-gray-50">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-400">{t.ws.notifications}</h3>
                  <p className="text-sm text-gray-400">Notifications</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{t.ws.inDevelopment}</p>
            </div>

            <div className="p-6 border-2 border-dashed rounded-xl bg-gray-50">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-400">{t.ws.reports}</h3>
                  <p className="text-sm text-gray-400">Reports</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{t.ws.inDevelopment}</p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500 mt-8 pt-8 border-t">
          <p>{t.common.appName} - {t.common.appDescription}</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </main>
  );
}
