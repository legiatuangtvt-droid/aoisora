'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { ToastProvider } from '@/components/ui/Toast';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import BottomNavigation from './BottomNavigation';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import PageTransition from '@/components/ui/PageTransition';

interface LayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const { isExpanded, isMobile, isTablet, isDesktop } = useSidebar();

  // Calculate main content padding based on device and sidebar state
  const getMainPadding = () => {
    if (isMobile) {
      return 'pl-0'; // No left padding on mobile
    }
    if (isTablet) {
      return 'pl-0'; // No left padding on tablet (sidebar is overlay)
    }
    // Desktop
    return isExpanded ? 'pl-60' : 'pl-16';
  };

  // Calculate bottom padding for mobile (bottom navigation)
  const getBottomPadding = () => {
    if (isMobile) {
      return 'pb-20'; // Space for bottom navigation
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar />
      <Sidebar />
      <LoadingIndicator />
      <main
        className={`pt-16 transition-all duration-300 ${getMainPadding()} ${getBottomPadding()}`}
      >
        <div className="p-4 md:p-6">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
      <BottomNavigation />
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
