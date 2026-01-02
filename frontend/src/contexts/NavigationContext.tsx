'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationContextType {
  isNavigating: boolean;
  setIsNavigating: (navigating: boolean) => void;
  expandedMenus: string[];
  setExpandedMenus: (menus: string[]) => void;
  toggleMenu: (menuId: string) => void;
  collapseAllMenus: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

const EXPANDED_MENUS_KEY = 'sidebarExpandedMenus';

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['hq-store']);
  const pathname = usePathname();

  // Load expanded menus from localStorage on mount
  useEffect(() => {
    const savedMenus = localStorage.getItem(EXPANDED_MENUS_KEY);
    if (savedMenus) {
      try {
        const parsed = JSON.parse(savedMenus);
        if (Array.isArray(parsed)) {
          setExpandedMenus(parsed);
        }
      } catch {
        // Invalid JSON, use default
      }
    }
  }, []);

  // Save expanded menus to localStorage
  useEffect(() => {
    localStorage.setItem(EXPANDED_MENUS_KEY, JSON.stringify(expandedMenus));
  }, [expandedMenus]);

  // Reset navigation state when pathname changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [menuId] // Only keep the newly opened menu (accordion behavior)
    );
  };

  const collapseAllMenus = () => {
    setExpandedMenus([]);
  };

  return (
    <NavigationContext.Provider
      value={{
        isNavigating,
        setIsNavigating,
        expandedMenus,
        setExpandedMenus,
        toggleMenu,
        collapseAllMenus,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
