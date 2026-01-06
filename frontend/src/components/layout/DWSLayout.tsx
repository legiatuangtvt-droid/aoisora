'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { ToastProvider } from '@/components/ui/Toast';
import TopBar from './TopBar';
import DWSSidebar from './DWSSidebar';
import BottomNavigation from './BottomNavigation';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import PageTransition from '@/components/ui/PageTransition';

interface DWSLayoutProps {
  children: ReactNode;
}

function DWSLayoutContent({ children }: DWSLayoutProps) {
  const { isExpanded, isMobile, isTablet, isDesktop } = useSidebar();

  // Calculate main content padding based on device and sidebar state
  const getMainPadding = () => {
    if (isMobile) {
      return 'pl-0';
    }
    if (isTablet) {
      return 'pl-0';
    }
    return isExpanded ? 'pl-60' : 'pl-16';
  };

  // Calculate bottom padding for mobile (bottom navigation)
  const getBottomPadding = () => {
    if (isMobile) {
      return 'pb-20';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <DWSSidebar />
      <LoadingIndicator />
      <main
        className={`pt-16 transition-all duration-300 ${getMainPadding()} ${getBottomPadding()}`}
      >
        <PageTransition>{children}</PageTransition>
      </main>
      <BottomNavigation />
    </div>
  );
}

export default function DWSLayout({ children }: DWSLayoutProps) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <NavigationProvider>
          <ToastProvider>
            <DWSLayoutContent>{children}</DWSLayoutContent>
          </ToastProvider>
        </NavigationProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
