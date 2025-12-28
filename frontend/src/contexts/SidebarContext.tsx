'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface SidebarContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Load sidebar state from localStorage
    const savedState = localStorage.getItem('sidebarExpanded');
    if (savedState !== null) {
      setIsExpanded(savedState === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', String(isExpanded));
  }, [isExpanded]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded, toggleSidebar }}>
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
