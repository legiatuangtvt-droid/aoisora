/**
 * Authenticated Fetch Wrapper with Double Token System
 *
 * Automatically handles:
 * - Token refresh when access token is expired
 * - Retry on 401 with new tokens
 * - Concurrent request queuing during refresh
 * - Session expiration detection
 */

import { tokenManager } from '../auth/tokenManager';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface FetchWithAuthOptions extends RequestInit {
  skipAuthCheck?: boolean;
  _isRetry?: boolean; // Internal flag to prevent infinite retry loops
}

let logoutCallback: (() => void) | null = null;

/**
 * Register logout callback to be called on session expiration
 */
export function registerLogoutCallback(callback: () => void) {
  logoutCallback = callback;
}

/**
 * Handle session expiration - clear tokens and redirect
 */
function handleSessionExpired(message?: string): void {
  console.warn('[Auth] Session expired, logging out...');

  // Clear all tokens
  tokenManager.clearTokens();

  // Also clear legacy storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('optichain_auth');
  }

  // Call logout callback if registered
  if (logoutCallback) {
    logoutCallback();
  }

  // Redirect to signin with message
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    const expiredMessage =
      message || 'Your session has expired. Please sign in again.';
    const encodedMessage = encodeURIComponent(expiredMessage);
    window.location.href = `/auth/signin?expired=true&message=${encodedMessage}&redirect=${currentPath}`;
  }
}

/**
 * Fetch wrapper with automatic token refresh and 401 retry
 */
export async function fetchWithAuth(
  endpoint: string,
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const { skipAuthCheck, _isRetry, ...fetchOptions } = options;

  // Skip auth for certain endpoints
  if (skipAuthCheck) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    return fetch(url, {
      ...fetchOptions,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(fetchOptions.headers as Record<string, string>),
      },
    });
  }

  // Check if access token needs refresh BEFORE making the request
  if (tokenManager.isAccessTokenExpired() && tokenManager.hasTokens()) {
    try {
      // Wait if refresh is already in progress
      if (tokenManager.isRefreshing()) {
        await tokenManager.waitForRefresh();
      } else {
        await tokenManager.refreshTokens();
      }
    } catch (error) {
      console.error('[Auth] Pre-request token refresh failed:', error);
      handleSessionExpired();
      throw error;
    }
  }

  // Get current access token
  const accessToken = tokenManager.getAccessToken();

  // Get switched user ID for testing mode (User Switcher)
  const switchedUserId =
    typeof window !== 'undefined'
      ? localStorage.getItem('optichain_switched_user_id')
      : null;

  // Build headers
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Add X-Switch-User-Id header for testing mode
  if (switchedUserId) {
    headers['X-Switch-User-Id'] = switchedUserId;
  }

  // Make the request
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 Unauthorized - try to refresh and retry once
  if (response.status === 401 && !_isRetry) {
    console.warn('[Auth] 401 Unauthorized - Attempting token refresh...');

    try {
      // Wait if refresh is already in progress, otherwise start one
      if (tokenManager.isRefreshing()) {
        await tokenManager.waitForRefresh();
      } else {
        await tokenManager.refreshTokens();
      }

      // Retry the original request with new token
      return fetchWithAuth(endpoint, {
        ...options,
        _isRetry: true,
      });
    } catch (error) {
      console.error('[Auth] Token refresh failed on 401:', error);
      handleSessionExpired();
      throw error;
    }
  }

  // If still 401 after retry, session is truly expired
  if (response.status === 401 && _isRetry) {
    console.warn('[Auth] 401 after retry - Session truly expired');
    handleSessionExpired();
  }

  return response;
}

/**
 * Convenience method for GET requests
 */
export async function get(endpoint: string, options?: FetchWithAuthOptions) {
  return fetchWithAuth(endpoint, { ...options, method: 'GET' });
}

/**
 * Convenience method for POST requests
 */
export async function post(
  endpoint: string,
  body?: unknown,
  options?: FetchWithAuthOptions
) {
  return fetchWithAuth(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Convenience method for PUT requests
 */
export async function put(
  endpoint: string,
  body?: unknown,
  options?: FetchWithAuthOptions
) {
  return fetchWithAuth(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Convenience method for DELETE requests
 */
export async function del(endpoint: string, options?: FetchWithAuthOptions) {
  return fetchWithAuth(endpoint, { ...options, method: 'DELETE' });
}
