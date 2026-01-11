/**
 * Session Configuration
 *
 * Centralized configuration for session management and idle timeout
 */

export const SESSION_CONFIG = {
  /**
   * Session timeout duration in milliseconds (120 minutes = 2 hours)
   */
  SESSION_TIMEOUT: parseInt(
    process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '7200000',
    10
  ),

  /**
   * Warning time before auto-logout in milliseconds (5 minutes)
   */
  WARNING_TIME: parseInt(
    process.env.NEXT_PUBLIC_WARNING_TIME || '300000',
    10
  ),

  /**
   * Interval for checking idle time in milliseconds (1 second)
   */
  CHECK_INTERVAL: parseInt(
    process.env.NEXT_PUBLIC_CHECK_INTERVAL || '1000',
    10
  ),

  /**
   * Throttle interval for activity tracking (1 second)
   */
  ACTIVITY_THROTTLE: 1000,

  /**
   * DOM events to track for user activity
   */
  TRACKED_EVENTS: [
    'mousemove',
    'click',
    'keydown',
    'scroll',
    'touchstart',
    'touchmove',
  ],
};

/**
 * Calculate when to show warning (in milliseconds)
 * Warning appears at: SESSION_TIMEOUT - WARNING_TIME
 */
export const getWarningThreshold = (): number => {
  return SESSION_CONFIG.SESSION_TIMEOUT - SESSION_CONFIG.WARNING_TIME;
};

/**
 * Format time in MM:SS
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get timer color class based on remaining time
 */
export const getTimerColorClass = (seconds: number): string => {
  if (seconds > 180) return 'text-green-500';
  if (seconds > 60) return 'text-yellow-500';
  return 'text-red-500';
};
