/**
 * Laravel Echo configuration for WebSocket connections via Reverb
 *
 * This module provides real-time event broadcasting using Laravel Reverb.
 * It connects to the WebSocket server and listens for task-related events.
 *
 * WebSocket can be disabled by:
 * - Setting NEXT_PUBLIC_WEBSOCKET_ENABLED=false
 * - Not providing NEXT_PUBLIC_REVERB_APP_KEY
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Check if WebSocket is enabled
const isWebSocketEnabled = (): boolean => {
  // Explicitly disabled
  if (process.env.NEXT_PUBLIC_WEBSOCKET_ENABLED === 'false') {
    return false;
  }
  // No Reverb key configured
  if (!process.env.NEXT_PUBLIC_REVERB_APP_KEY) {
    return false;
  }
  return true;
};

// Make Pusher available globally (required by Laravel Echo)
if (typeof window !== 'undefined' && isWebSocketEnabled()) {
  (window as unknown as { Pusher: typeof Pusher }).Pusher = Pusher;
}

// Echo instance (lazy initialized)
let echoInstance: Echo<'reverb'> | null = null;

/**
 * Get or create the Echo instance
 * Returns null if WebSocket is disabled
 */
export function getEcho(): Echo<'reverb'> | null {
  // Check if WebSocket is enabled
  if (!isWebSocketEnabled()) {
    return null;
  }

  // Only initialize on client side
  if (typeof window === 'undefined') {
    return null;
  }

  if (!echoInstance) {
    const reverbHost = process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost';
    const reverbPort = process.env.NEXT_PUBLIC_REVERB_PORT || '8080';
    const reverbKey = process.env.NEXT_PUBLIC_REVERB_APP_KEY;
    const reverbScheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http';

    if (!reverbKey) {
      console.warn('[WebSocket] Reverb key not configured, WebSocket disabled');
      return null;
    }

    try {
      echoInstance = new Echo({
        broadcaster: 'reverb',
        key: reverbKey,
        wsHost: reverbHost,
        wsPort: parseInt(reverbPort),
        wssPort: parseInt(reverbPort),
        forceTLS: reverbScheme === 'https',
        enabledTransports: ['ws', 'wss'],
        disableStats: true,
      });
    } catch (error) {
      console.warn('[WebSocket] Failed to initialize Echo:', error);
      return null;
    }
  }

  return echoInstance;
}

/**
 * Task update event payload from the server
 */
export interface TaskUpdateEvent {
  action: 'created' | 'updated' | 'deleted' | 'status_changed';
  task: {
    task_id: number;
    task_name: string;
    status_id: number;
    dept_id: number | null;
    assigned_store_id: number | null;
    start_date: string | null;
    end_date: string | null;
    priority: string | null;
    updated_at: string;
  };
  timestamp: string;
}

/**
 * Subscribe to task updates on the 'tasks' channel
 *
 * @param callback Function to call when a task update is received
 * @returns Cleanup function to unsubscribe
 */
export function subscribeToTaskUpdates(
  callback: (event: TaskUpdateEvent) => void
): () => void {
  const echo = getEcho();

  if (!echo) {
    console.warn('Echo not available (server-side)');
    return () => {};
  }

  // Subscribe to the public 'tasks' channel
  const channel = echo.channel('tasks');

  // Listen for 'task.updated' events
  channel.listen('.task.updated', (event: TaskUpdateEvent) => {
    console.log('[WebSocket] Task update received:', event);
    callback(event);
  });

  // Return cleanup function
  return () => {
    echo.leaveChannel('tasks');
  };
}

/**
 * Check if WebSocket connection is active
 */
export function isConnected(): boolean {
  const echo = getEcho();
  if (!echo) return false;

  // Access the underlying Pusher connector
  const connector = echo.connector as { pusher?: { connection?: { state?: string } } };
  return connector?.pusher?.connection?.state === 'connected';
}

/**
 * Disconnect from WebSocket server
 */
export function disconnect(): void {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}
