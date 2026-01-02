'use client';

import { useNavigation } from '@/contexts/NavigationContext';

export default function LoadingIndicator() {
  const { isNavigating } = useNavigation();

  if (!isNavigating) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50">
      {/* Progress bar */}
      <div className="h-0.5 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#C5055B] via-pink-400 to-[#C5055B] animate-loading-bar" />
      </div>
    </div>
  );
}

// Spinner component for inline loading states
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <svg
        className="text-[#C5055B]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}
