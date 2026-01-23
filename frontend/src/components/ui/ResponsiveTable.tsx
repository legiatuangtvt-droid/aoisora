'use client';

import React from 'react';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ResponsiveTable wraps a table in a horizontal scroll container for mobile devices.
 * It also adds visual indicators (shadows) to show there's more content to scroll.
 */
export function ResponsiveTable({ children, className = '' }: ResponsiveTableProps) {
  const [showLeftShadow, setShowLeftShadow] = React.useState(false);
  const [showRightShadow, setShowRightShadow] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const checkScroll = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftShadow(scrollLeft > 0);
    setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  return (
    <div className={`relative ${className}`}>
      {/* Left scroll indicator shadow */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
          showLeftShadow ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Right scroll indicator shadow */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
          showRightShadow ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {children}
      </div>
    </div>
  );
}

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * MobileCard is a container for displaying table row data as a card on mobile.
 * Use with `hidden md:table-row` on the actual tr and `md:hidden` on MobileCard.
 */
export function MobileCard({ children, className = '', onClick }: MobileCardProps) {
  return (
    <div
      className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-3 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface MobileCardFieldProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

/**
 * MobileCardField displays a label-value pair in a mobile card.
 */
export function MobileCardField({ label, value, className = '' }: MobileCardFieldProps) {
  return (
    <div className={`flex justify-between items-center py-1.5 ${className}`}>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

/**
 * Hook to check if we're on mobile (< 768px)
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

/**
 * Hook to get responsive breakpoint info
 */
export function useResponsive() {
  const [state, setState] = React.useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
  });

  React.useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      setState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width,
      });
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return state;
}
