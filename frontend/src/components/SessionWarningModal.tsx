'use client';

import React, { useEffect, useState } from 'react';
import { formatTime, getTimerColorClass } from '@/config/session';

interface SessionWarningModalProps {
  isOpen: boolean;
  timeRemaining: number; // in seconds
  onStayLoggedIn: () => void;
  onLogOut: () => void;
}

export const SessionWarningModal: React.FC<SessionWarningModalProps> = ({
  isOpen,
  timeRemaining,
  onStayLoggedIn,
  onLogOut,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      // Delay removing animation class to allow fade-out
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) {
    return null;
  }

  const formattedTime = formatTime(timeRemaining);
  const timerColorClass = getTimerColorClass(timeRemaining);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-[9998] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onStayLoggedIn}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="warning-title"
        aria-describedby="warning-description"
        className={`
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          z-[9999]
          w-full max-w-md
          bg-white dark:bg-gray-800
          rounded-xl shadow-2xl
          p-8
          transition-all duration-300
          ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          ${isOpen ? 'animate-shake' : ''}
        `}
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2
          id="warning-title"
          className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2"
        >
          Session Warning
        </h2>

        {/* Description */}
        <p
          id="warning-description"
          className="text-center text-gray-600 dark:text-gray-300 mb-4"
        >
          Your session is about to expire due to inactivity
        </p>

        {/* Countdown Label */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          You will be automatically logged out in:
        </p>

        {/* Timer */}
        <div
          role="timer"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Time remaining: ${formattedTime}`}
          className="flex justify-center mb-8"
        >
          <div
            className={`
              text-6xl font-bold font-mono
              ${timerColorClass}
              transition-colors duration-500
            `}
          >
            {formattedTime}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {/* Stay Logged In Button */}
          <button
            onClick={onStayLoggedIn}
            className="
              flex-1
              px-6 py-3
              bg-blue-600 hover:bg-blue-700
              text-white font-semibold
              rounded-lg
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            "
          >
            Stay Logged In
          </button>

          {/* Log Out Button */}
          <button
            onClick={onLogOut}
            className="
              flex-1
              px-6 py-3
              bg-white hover:bg-gray-100
              dark:bg-gray-700 dark:hover:bg-gray-600
              border border-gray-300 dark:border-gray-600
              text-gray-700 dark:text-gray-200 font-semibold
              rounded-lg
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
            "
          >
            Log Out
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translate(-50%, -50%) translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translate(-50%, -50%) translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translate(-50%, -50%) translateX(5px);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out 0.3s;
        }
      `}</style>
    </>
  );
};
