'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { ViewMode } from '@/types/tasks';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  resultsCount?: number;
  commentsCount?: number;
  isLoading?: boolean;
}

/**
 * ViewModeToggle - Pill-style toggle component for switching between Results and Comment views
 *
 * Features:
 * - Sliding indicator animation
 * - Press feedback (scale animation)
 * - Keyboard navigation (ArrowLeft/ArrowRight)
 * - Loading state with spinner
 * - Badge count display
 * - Accessibility support (ARIA roles, focus states)
 */
export default function ViewModeToggle({
  viewMode,
  onViewModeChange,
  resultsCount,
  commentsCount,
  isLoading = false,
}: ViewModeToggleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsButtonRef = useRef<HTMLButtonElement>(null);
  const commentButtonRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isPressed, setIsPressed] = useState<ViewMode | null>(null);

  // Calculate indicator position based on active button
  const updateIndicator = useCallback(() => {
    const activeButton = viewMode === 'results' ? resultsButtonRef.current : commentButtonRef.current;
    const container = containerRef.current;

    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [viewMode]);

  useEffect(() => {
    updateIndicator();
    // Update on resize
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const newMode = e.key === 'ArrowLeft' ? 'results' : 'comment';
      if (newMode !== viewMode && !isLoading) {
        onViewModeChange(newMode);
      }
    }
  };

  // Visual feedback - press animation
  const handleMouseDown = (mode: ViewMode) => {
    if (!isLoading) {
      setIsPressed(mode);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(null);
  };

  const handleClick = (mode: ViewMode) => {
    if (mode !== viewMode && !isLoading) {
      onViewModeChange(mode);
    }
  };

  const modes: { key: ViewMode; label: string; count?: number; icon: React.ReactNode; ref: React.RefObject<HTMLButtonElement | null> }[] = [
    {
      key: 'results',
      label: 'Results',
      count: resultsCount,
      ref: resultsButtonRef,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      key: 'comment',
      label: 'Comment',
      count: commentsCount,
      ref: commentButtonRef,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex items-center bg-gray-100 rounded-lg p-1"
      role="tablist"
      aria-label="View mode"
      onKeyDown={handleKeyDown}
    >
      {/* Sliding indicator background */}
      <div
        className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm transition-all duration-300 ease-out"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {modes.map((mode) => {
        const isActive = viewMode === mode.key;
        const isPressing = isPressed === mode.key;

        return (
          <button
            key={mode.key}
            ref={mode.ref as React.RefObject<HTMLButtonElement>}
            onClick={() => handleClick(mode.key)}
            onMouseDown={() => handleMouseDown(mode.key)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            disabled={isLoading}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${mode.key}-panel`}
            tabIndex={isActive ? 0 : -1}
            className={`
              relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
              transition-all duration-200 ease-out
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5055B] focus-visible:ring-offset-2
              ${isActive
                ? 'text-[#C5055B]'
                : 'text-gray-500 hover:text-gray-700'
              }
              ${isPressing ? 'scale-95' : 'scale-100'}
              ${isLoading ? 'cursor-wait opacity-70' : 'cursor-pointer'}
            `}
          >
            {/* Loading spinner for active tab */}
            {isLoading && isActive ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              mode.icon
            )}

            <span>{mode.label}</span>

            {/* Badge count - only show if count > 0 */}
            {mode.count !== undefined && mode.count > 0 && (
              <span className={`
                ml-1 px-1.5 py-0.5 text-xs rounded-full transition-colors duration-200
                ${isActive
                  ? 'bg-pink-100 text-[#C5055B]'
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {mode.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
