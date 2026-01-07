/**
 * React hook for subscribing to real-time task updates via WebSocket
 *
 * Usage:
 * ```tsx
 * const { lastUpdate, isConnected } = useTaskUpdates({
 *   onTaskCreated: (task) => { ... },
 *   onTaskUpdated: (task) => { ... },
 *   onTaskDeleted: (task) => { ... },
 *   onTaskStatusChanged: (task) => { ... },
 * });
 * ```
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { subscribeToTaskUpdates, TaskUpdateEvent, isConnected as checkConnection } from '@/lib/echo';

interface UseTaskUpdatesOptions {
  /**
   * Called when a new task is created
   */
  onTaskCreated?: (task: TaskUpdateEvent['task']) => void;

  /**
   * Called when a task is updated
   */
  onTaskUpdated?: (task: TaskUpdateEvent['task']) => void;

  /**
   * Called when a task is deleted
   */
  onTaskDeleted?: (task: TaskUpdateEvent['task']) => void;

  /**
   * Called when a task's status changes
   */
  onTaskStatusChanged?: (task: TaskUpdateEvent['task']) => void;

  /**
   * Called for any task update (before specific handlers)
   */
  onAnyUpdate?: (event: TaskUpdateEvent) => void;

  /**
   * Whether to enable the subscription (default: true)
   */
  enabled?: boolean;
}

interface UseTaskUpdatesResult {
  /**
   * The last received update event
   */
  lastUpdate: TaskUpdateEvent | null;

  /**
   * Whether the WebSocket is connected
   */
  isConnected: boolean;

  /**
   * Number of updates received in this session
   */
  updateCount: number;
}

/**
 * Hook to subscribe to real-time task updates
 */
export function useTaskUpdates(options: UseTaskUpdatesOptions = {}): UseTaskUpdatesResult {
  const {
    onTaskCreated,
    onTaskUpdated,
    onTaskDeleted,
    onTaskStatusChanged,
    onAnyUpdate,
    enabled = true,
  } = options;

  const [lastUpdate, setLastUpdate] = useState<TaskUpdateEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);

  // Use refs to avoid stale closures in the callback
  const callbacksRef = useRef({
    onTaskCreated,
    onTaskUpdated,
    onTaskDeleted,
    onTaskStatusChanged,
    onAnyUpdate,
  });

  // Update refs when callbacks change
  useEffect(() => {
    callbacksRef.current = {
      onTaskCreated,
      onTaskUpdated,
      onTaskDeleted,
      onTaskStatusChanged,
      onAnyUpdate,
    };
  }, [onTaskCreated, onTaskUpdated, onTaskDeleted, onTaskStatusChanged, onAnyUpdate]);

  // Handle incoming task updates
  const handleUpdate = useCallback((event: TaskUpdateEvent) => {
    setLastUpdate(event);
    setUpdateCount((prev) => prev + 1);

    const callbacks = callbacksRef.current;

    // Call generic handler first
    callbacks.onAnyUpdate?.(event);

    // Call specific handler based on action
    switch (event.action) {
      case 'created':
        callbacks.onTaskCreated?.(event.task);
        break;
      case 'updated':
        callbacks.onTaskUpdated?.(event.task);
        break;
      case 'deleted':
        callbacks.onTaskDeleted?.(event.task);
        break;
      case 'status_changed':
        callbacks.onTaskStatusChanged?.(event.task);
        break;
    }
  }, []);

  // Subscribe to task updates
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Check connection status periodically
    const checkConnectionStatus = () => {
      setIsConnected(checkConnection());
    };

    // Initial check
    checkConnectionStatus();

    // Subscribe to updates
    const unsubscribe = subscribeToTaskUpdates(handleUpdate);

    // Check connection status every 5 seconds
    const intervalId = setInterval(checkConnectionStatus, 5000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [enabled, handleUpdate]);

  return {
    lastUpdate,
    isConnected,
    updateCount,
  };
}

export default useTaskUpdates;
