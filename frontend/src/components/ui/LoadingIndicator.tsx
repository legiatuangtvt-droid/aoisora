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
export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className = '',
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray' | 'pink' | 'blue' | 'green';
  className?: string;
}) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-[#C5055B]',
    white: 'text-white',
    gray: 'text-gray-400',
    pink: 'text-pink-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin ${className}`}>
      <svg
        className={colorClasses[color]}
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

// Dots loading animation
export function LoadingDots({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} bg-[#C5055B] rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// Loading overlay for sections/components
export function LoadingOverlay({
  show,
  message,
  blur = true,
}: {
  show: boolean;
  message?: string;
  blur?: boolean;
}) {
  if (!show) return null;

  return (
    <div
      className={`absolute inset-0 bg-white/70 dark:bg-gray-900/70 ${
        blur ? 'backdrop-blur-sm' : ''
      } z-10 flex items-center justify-center rounded-inherit`}
    >
      <div className="text-center">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>
        )}
      </div>
    </div>
  );
}

// Button with loading state
export function LoadingButton({
  children,
  loading,
  disabled,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
}: {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-[#C5055B] text-white hover:bg-[#a00449] focus:ring-[#C5055B]',
    secondary:
      'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const spinnerSize = {
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && (
        <LoadingSpinner
          size={spinnerSize[size]}
          color={variant === 'primary' || variant === 'danger' ? 'white' : 'gray'}
        />
      )}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
    </button>
  );
}

// Inline loading text
export function LoadingText({
  loading,
  children,
  fallback = 'Loading...',
}: {
  loading: boolean;
  children: React.ReactNode;
  fallback?: string;
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 text-gray-400">
        <LoadingSpinner size="xs" color="gray" />
        {fallback}
      </span>
    );
  }
  return <>{children}</>;
}
