'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { ActivityTracker } from '@/services/ActivityTracker';
import { SESSION_CONFIG, getWarningThreshold } from '@/config/session';

interface IdleTimerContextValue {
  isIdle: boolean;
  showWarning: boolean;
  timeRemaining: number; // in seconds
  extendSession: () => Promise<void>;
  resetTimer: () => void;
}

const IdleTimerContext = createContext<IdleTimerContextValue | undefined>(undefined);

interface IdleTimerProviderProps {
  children: React.ReactNode;
}

export const IdleTimerProvider: React.FC<IdleTimerProviderProps> = ({ children }) => {
  const [isIdle, setIsIdle] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const activityTrackerRef = useRef<ActivityTracker | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handle user activity - reset idle timer
   */
  const handleActivity = useCallback(() => {
    setIsIdle(false);
    setShowWarning(false);
    clearTimeout(logoutTimeoutRef.current!);
  }, []);

  /**
   * Reset timer manually
   */
  const resetTimer = useCallback(() => {
    if (activityTrackerRef.current) {
      activityTrackerRef.current.resetActivityTime();
      handleActivity();
    }
  }, [handleActivity]);

  /**
   * Extend session by calling backend API
   */
  const extendSession = useCallback(async () => {
    try {
      const token = localStorage.getItem('optichain_token');
      if (!token) {
        throw new Error('No token found');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to extend session');
      }

      const data = await response.json();
      console.log('Session extended:', data);

      // Reset timer after successful extension
      resetTimer();
    } catch (error) {
      console.error('Failed to extend session:', error);
      // On error, keep the warning open so user can try again or logout
    }
  }, [resetTimer]);

  /**
   * Auto-logout when session expires
   */
  const handleAutoLogout = useCallback(() => {
    console.log('Auto-logout triggered');

    // Clear all storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('last_activity_time');

    // Redirect to sign in
    window.location.href = '/auth/signin?reason=session_expired';
  }, []);

  /**
   * Check idle time periodically
   */
  const checkIdleTime = useCallback(() => {
    if (!activityTrackerRef.current) return;

    const idleTime = activityTrackerRef.current.getIdleTime();
    const warningThreshold = getWarningThreshold();

    // console.log('Idle time:', Math.floor(idleTime / 1000), 'seconds');

    if (idleTime >= SESSION_CONFIG.SESSION_TIMEOUT) {
      // Session expired - auto logout
      handleAutoLogout();
    } else if (idleTime >= warningThreshold) {
      // Show warning
      setIsIdle(true);
      setShowWarning(true);

      // Calculate time remaining until auto-logout
      const remaining = Math.floor(
        (SESSION_CONFIG.SESSION_TIMEOUT - idleTime) / 1000
      );
      setTimeRemaining(remaining);

      // Set timeout for auto-logout if not already set
      if (!logoutTimeoutRef.current) {
        const timeUntilLogout = SESSION_CONFIG.SESSION_TIMEOUT - idleTime;
        logoutTimeoutRef.current = setTimeout(handleAutoLogout, timeUntilLogout);
      }
    } else {
      // Active state
      setIsIdle(false);
      setShowWarning(false);
    }
  }, [handleAutoLogout]);

  /**
   * Initialize activity tracker on mount
   */
  useEffect(() => {
    // Create activity tracker
    activityTrackerRef.current = new ActivityTracker({
      events: SESSION_CONFIG.TRACKED_EVENTS,
      throttleMs: SESSION_CONFIG.ACTIVITY_THROTTLE,
      onActivity: handleActivity,
    });

    // Start tracking
    activityTrackerRef.current.start();

    // Start periodic idle check
    checkIntervalRef.current = setInterval(
      checkIdleTime,
      SESSION_CONFIG.CHECK_INTERVAL
    );

    // Cleanup on unmount
    return () => {
      if (activityTrackerRef.current) {
        activityTrackerRef.current.stop();
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
    };
  }, [handleActivity, checkIdleTime]);

  const value: IdleTimerContextValue = {
    isIdle,
    showWarning,
    timeRemaining,
    extendSession,
    resetTimer,
  };

  return <IdleTimerContext.Provider value={value}>{children}</IdleTimerContext.Provider>;
};

/**
 * Hook to use IdleTimer context
 */
export const useIdleTimer = (): IdleTimerContextValue => {
  const context = useContext(IdleTimerContext);
  if (!context) {
    throw new Error('useIdleTimer must be used within IdleTimerProvider');
  }
  return context;
};
