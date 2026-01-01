'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { ToastProvider } from '@/components/ui/Toast';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import PageTransition from '@/components/ui/PageTransition';

interface LayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const { isExpanded } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Sidebar />
      <LoadingIndicator />
      <main
        className={`pt-16 transition-all duration-300 ${
          isExpanded ? 'pl-60' : 'pl-16'
        }`}
      >
        <div className="p-6">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <NavigationProvider>
          <ToastProvider>
            <LayoutContent>{children}</LayoutContent>
          </ToastProvider>
        </NavigationProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
