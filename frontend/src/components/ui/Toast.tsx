'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], options?: { title?: string; duration?: number }) => void;
  showDevelopingToast: () => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Icons for different toast types
const ToastIcons = {
  success: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((
    message: string,
    type: Toast['type'] = 'info',
    options?: { title?: string; duration?: number }
  ) => {
    const id = Date.now().toString();
    const duration = options?.duration ?? (type === 'error' ? 5000 : 3000);
    setToasts(prev => [...prev, { id, message, type, title: options?.title }]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const showDevelopingToast = useCallback(() => {
    showToast('This feature is under development', 'info');
  }, [showToast]);

  const showSuccess = useCallback((message: string, title?: string) => {
    showToast(message, 'success', { title: title || 'Success' });
  }, [showToast]);

  const showError = useCallback((message: string, title?: string) => {
    showToast(message, 'error', { title: title || 'Error', duration: 5000 });
  }, [showToast]);

  const showWarning = useCallback((message: string, title?: string) => {
    showToast(message, 'warning', { title: title || 'Warning' });
  }, [showToast]);

  const showInfo = useCallback((message: string, title?: string) => {
    showToast(message, 'info', { title });
  }, [showToast]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-200';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/50 border-amber-500 text-amber-800 dark:text-amber-200';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-200';
      default:
        return 'bg-blue-50 dark:bg-blue-900/50 border-blue-500 text-blue-800 dark:text-blue-200';
    }
  };

  const getIconColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, showDevelopingToast, showSuccess, showError, showWarning, showInfo }}>
      {children}

      {/* Toast Container - Top Right */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-[400px]">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`${getToastStyles(toast.type)} border-l-4 px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 min-w-[300px] animate-slide-in-right backdrop-blur-sm`}
          >
            {/* Icon */}
            <div className={getIconColor(toast.type)}>
              {ToastIcons[toast.type]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="font-semibold text-sm mb-0.5">{toast.title}</p>
              )}
              <p className="text-sm break-words">{toast.message}</p>
            </div>

            {/* Close button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="hover:bg-black/10 dark:hover:bg-white/10 rounded p-1 transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
