/**
 * ActivityTracker Service
 *
 * Tracks user activity (mouse, keyboard, touch events) to determine idle time.
 * Supports throttling to avoid excessive callback invocations.
 * Syncs across multiple tabs using localStorage.
 */

export interface ActivityTrackerConfig {
  events: string[];
  throttleMs: number;
  onActivity: () => void;
}

export class ActivityTracker {
  private lastActivityTime: number;
  private throttleMs: number;
  private events: string[];
  private onActivity: () => void;
  private listeners: Map<string, EventListener>;
  private isActive: boolean;
  private storageKey: string;

  constructor(config: ActivityTrackerConfig) {
    this.events = config.events;
    this.throttleMs = config.throttleMs;
    this.onActivity = config.onActivity;
    this.listeners = new Map();
    this.isActive = false;
    this.storageKey = 'last_activity_time';

    // Initialize with current time or stored time
    const storedTime = this.getStoredActivityTime();
    this.lastActivityTime = storedTime || Date.now();
  }

  /**
   * Start tracking user activities
   */
  public start(): void {
    if (this.isActive) {
      console.warn('ActivityTracker is already active');
      return;
    }

    this.isActive = true;
    this.attachEventListeners();
    this.attachStorageListener();

    // Initialize activity time
    this.updateActivityTime();
  }

  /**
   * Stop tracking user activities
   */
  public stop(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    this.detachEventListeners();
    this.detachStorageListener();
  }

  /**
   * Get the last recorded activity time
   */
  public getLastActivityTime(): number {
    return this.lastActivityTime;
  }

  /**
   * Reset activity time to current time
   */
  public resetActivityTime(): void {
    this.updateActivityTime();
  }

  /**
   * Attach event listeners to DOM
   */
  private attachEventListeners(): void {
    this.events.forEach((eventName) => {
      const listener = this.handleActivity.bind(this);
      this.listeners.set(eventName, listener);
      window.addEventListener(eventName, listener, { passive: true });
    });
  }

  /**
   * Detach event listeners from DOM
   */
  private detachEventListeners(): void {
    this.listeners.forEach((listener, eventName) => {
      window.removeEventListener(eventName, listener);
    });
    this.listeners.clear();
  }

  /**
   * Listen to storage events for cross-tab sync
   */
  private attachStorageListener(): void {
    window.addEventListener('storage', this.handleStorageChange);
  }

  /**
   * Stop listening to storage events
   */
  private detachStorageListener(): void {
    window.removeEventListener('storage', this.handleStorageChange);
  }

  /**
   * Handle user activity events (throttled)
   */
  private handleActivity = (): void => {
    const now = Date.now();

    // Throttle: only update if enough time has passed
    if (now - this.lastActivityTime >= this.throttleMs) {
      this.updateActivityTime();
    }
  };

  /**
   * Handle storage change events (cross-tab sync)
   */
  private handleStorageChange = (event: StorageEvent): void => {
    if (event.key === this.storageKey && event.newValue) {
      const newTime = parseInt(event.newValue, 10);
      if (!isNaN(newTime)) {
        this.lastActivityTime = newTime;
        this.onActivity();
      }
    }
  };

  /**
   * Update last activity time and trigger callback
   */
  private updateActivityTime(): void {
    const now = Date.now();
    this.lastActivityTime = now;
    this.storeActivityTime(now);
    this.onActivity();
  }

  /**
   * Store activity time in localStorage
   */
  private storeActivityTime(time: number): void {
    try {
      localStorage.setItem(this.storageKey, time.toString());
    } catch (error) {
      console.error('Failed to store activity time:', error);
    }
  }

  /**
   * Retrieve stored activity time from localStorage
   */
  private getStoredActivityTime(): number | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const time = parseInt(stored, 10);
        return isNaN(time) ? null : time;
      }
    } catch (error) {
      console.error('Failed to retrieve activity time:', error);
    }
    return null;
  }

  /**
   * Calculate idle time in milliseconds
   */
  public getIdleTime(): number {
    return Date.now() - this.lastActivityTime;
  }

  /**
   * Check if user is idle for a given duration
   */
  public isIdleFor(durationMs: number): boolean {
    return this.getIdleTime() >= durationMs;
  }
}

// Singleton instance (optional usage pattern)
let trackerInstance: ActivityTracker | null = null;

export const createActivityTracker = (config: ActivityTrackerConfig): ActivityTracker => {
  if (trackerInstance) {
    trackerInstance.stop();
  }
  trackerInstance = new ActivityTracker(config);
  return trackerInstance;
};

export const getActivityTracker = (): ActivityTracker | null => {
  return trackerInstance;
};
