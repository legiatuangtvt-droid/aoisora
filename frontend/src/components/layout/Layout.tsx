'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { ToastProvider } from '@/components/ui/Toast';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const { isExpanded } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Sidebar />
      <main
        className={`pt-16 transition-all duration-300 ${
          isExpanded ? 'pl-60' : 'pl-16'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <ToastProvider>
          <LayoutContent>{children}</LayoutContent>
        </ToastProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
