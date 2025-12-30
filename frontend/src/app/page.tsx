'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Simple API functions
async function checkHealth() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const response = await fetch(API_URL.replace('/api/v1', '/health'));
  return await response.json();
}

// Menu tile interface
interface MenuTile {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
  isExternal?: boolean;
  isUnderDevelopment?: boolean;
  notificationCount?: number;
}

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<{ version?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const health = await checkHealth();
        setBackendStatus(health);
      } catch {
        // Silently fail - backend offline
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Menu tiles configuration
  const menuTiles: MenuTile[] = [
    {
      id: 'dws',
      title: 'DWS',
      subtitle: 'Daily Work Schedule',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      href: '/dws/daily-schedule',
      isExternal: true,
    },
    {
      id: 'task-hq',
      title: 'Task from HQ',
      subtitle: 'Assignments & status',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      href: '/tasks',
      isExternal: true,
    },
    {
      id: 'faq',
      title: 'FAQ',
      subtitle: 'Frequently Asked Questions',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: '/faq',
      isUnderDevelopment: true,
    },
    {
      id: 'manual',
      title: 'MANUAL',
      subtitle: 'Aoi knowledge base',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: '/manual',
    },
    {
      id: 'quality',
      title: 'Check Quality',
      subtitle: 'Quality Through Time',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: '/quality',
      isUnderDevelopment: true,
    },
    {
      id: 'training',
      title: 'Training',
      subtitle: 'Learning & upskilling',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      href: '/training',
      isUnderDevelopment: true,
      notificationCount: 5,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50">
      {/* Header */}
      <header className="pt-12 pb-8 px-4">
        <h1 className="text-5xl font-bold text-center text-sky-500 tracking-wide">
          AOI SORA
        </h1>
      </header>

      {/* Menu Grid */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {menuTiles.map((tile) => (
              <MenuTileCard key={tile.id} tile={tile} />
            ))}
          </div>

          {/* Tip */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Tip: Right-click a tile to copy its link or open in a new tab.
          </p>
        </div>
      </div>

      {/* Backend Status Indicator (small, bottom right) */}
      <div className="fixed bottom-4 right-4">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg ${
            backendStatus
              ? 'bg-green-100 text-green-700'
              : loading
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
          }`}
          title={backendStatus ? `Backend v${backendStatus.version}` : 'Backend offline'}
        >
          <div className={`w-2 h-2 rounded-full ${
            backendStatus
              ? 'bg-green-500'
              : loading
                ? 'bg-yellow-500 animate-pulse'
                : 'bg-red-500'
          }`} />
          <span>
            {backendStatus ? 'Online' : loading ? 'Connecting...' : 'Offline'}
          </span>
        </div>
      </div>
    </main>
  );
}

// Menu Tile Card Component
function MenuTileCard({ tile }: { tile: MenuTile }) {
  const cardContent = (
    <div className="relative bg-sky-500 hover:bg-sky-600 text-white rounded-2xl p-5 h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      {/* Notification Badge */}
      {tile.notificationCount && tile.notificationCount > 0 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
          {tile.notificationCount}
        </div>
      )}

      {/* Icon */}
      <div className="mb-3">
        {tile.icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold mb-1">{tile.title}</h3>

      {/* Subtitle */}
      <p className="text-sky-100 text-sm mb-3">{tile.subtitle}</p>

      {/* Action Button */}
      <div className="mt-auto">
        {tile.isUnderDevelopment ? (
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs">
            Under development
          </span>
        ) : (
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs">
            {tile.isExternal ? 'Opens new tab' : 'Open'}
          </span>
        )}
      </div>
    </div>
  );

  if (tile.isUnderDevelopment) {
    return <div className="opacity-80">{cardContent}</div>;
  }

  return (
    <Link href={tile.href} target={tile.isExternal ? '_blank' : undefined}>
      {cardContent}
    </Link>
  );
}
