'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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

// Menu structure with parent-child relationships
// This mirrors the menuItems in Sidebar.tsx
const menuStructure = [
  {
    id: 'hq-store',
    route: '/tasks',
    children: [
      { id: 'list-task', route: '/tasks/list' },
      { id: 'detail', route: '/tasks/detail' },
      { id: 'message', route: '/tasks/messages' },
    ],
  },
  { id: 'todo', route: '/tasks/todo' },
  { id: 'library', route: '/tasks/library' },
  { id: 'report', route: '/tasks/report' },
  {
    id: 'users',
    route: '/users',
    children: [
      { id: 'user-info', route: '/tasks/info' },
      { id: 'store-info', route: '/tasks/store-info' },
    ],
  },
];

// Find parent menu id for a given pathname
function findParentMenuForPath(pathname: string): string | null {
  for (const menu of menuStructure) {
    if (menu.children) {
      for (const child of menu.children) {
        // Check exact match or if pathname starts with child route
        if (pathname === child.route || pathname.startsWith(child.route + '/')) {
          return menu.id;
        }
        // Special case for task detail: /tasks/[id] should match /tasks/detail
        if (child.route === '/tasks/detail' && /^\/tasks\/\d+$/.test(pathname)) {
          return menu.id;
        }
      }
    }
  }
  return null;
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const pathname = usePathname();

  // Find and expand the correct parent menu based on pathname
  const expandParentMenuForPath = useCallback((path: string) => {
    const parentId = findParentMenuForPath(path);
    if (parentId) {
      setExpandedMenus([parentId]);
    }
  }, []);

  // Initialize: Load from localStorage or auto-expand based on pathname
  useEffect(() => {
    if (hasInitialized) return;

    const savedMenus = localStorage.getItem(EXPANDED_MENUS_KEY);
    if (savedMenus) {
      try {
        const parsed = JSON.parse(savedMenus);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Validate saved menu against current path
          const parentId = findParentMenuForPath(pathname);
          if (parentId && !parsed.includes(parentId)) {
            // Current path's parent is not in saved state, use current path's parent
            setExpandedMenus([parentId]);
          } else {
            setExpandedMenus(parsed);
          }
        } else {
          // No saved state, auto-expand based on pathname
          expandParentMenuForPath(pathname);
        }
      } catch {
        // Invalid JSON, auto-expand based on pathname
        expandParentMenuForPath(pathname);
      }
    } else {
      // No saved state, auto-expand based on pathname
      expandParentMenuForPath(pathname);
    }
    setHasInitialized(true);
  }, [pathname, expandParentMenuForPath, hasInitialized]);

  // Save expanded menus to localStorage
  useEffect(() => {
    if (hasInitialized) {
      localStorage.setItem(EXPANDED_MENUS_KEY, JSON.stringify(expandedMenus));
    }
  }, [expandedMenus, hasInitialized]);

  // Auto-expand correct parent menu when pathname changes
  useEffect(() => {
    if (!hasInitialized) return;

    const parentId = findParentMenuForPath(pathname);
    if (parentId && !expandedMenus.includes(parentId)) {
      // Current path's parent is not expanded, expand it
      setExpandedMenus([parentId]);
    }
    setIsNavigating(false);
  }, [pathname, hasInitialized]);

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
