'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface SidebarContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Breakpoints
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  // Detect device type based on window width
  const updateDeviceType = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    if (width < MOBILE_BREAKPOINT) {
      setDeviceType('mobile');
      setIsExpanded(false);
    } else if (width < TABLET_BREAKPOINT) {
      setDeviceType('tablet');
      setIsExpanded(false);
    } else {
      setDeviceType('desktop');
    }
  }, []);

  // Initialize and handle resize
  useEffect(() => {
    updateDeviceType();

    // Load sidebar state from localStorage only on desktop
    const savedState = localStorage.getItem('sidebarExpanded');
    if (savedState !== null && window.innerWidth >= TABLET_BREAKPOINT) {
      setIsExpanded(savedState === 'true');
    }

    const handleResize = () => {
      updateDeviceType();
      // Close mobile menu on resize to larger screen
      if (window.innerWidth >= MOBILE_BREAKPOINT) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateDeviceType]);

  // Save state to localStorage only on desktop
  useEffect(() => {
    if (deviceType === 'desktop') {
      localStorage.setItem('sidebarExpanded', String(isExpanded));
    }
  }, [isExpanded, deviceType]);

  // Close mobile menu when pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleSidebar = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        toggleSidebar,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        deviceType,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
