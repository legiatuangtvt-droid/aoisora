/**
 * Authenticated Fetch Wrapper
 *
 * Automatically handles:
 * - 401 Unauthorized responses (auto-logout)
 * - Authorization header injection
 * - Session expiration detection
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface FetchWithAuthOptions extends RequestInit {
  skipAuthCheck?: boolean;
}

let logoutCallback: (() => void) | null = null;

/**
 * Register logout callback to be called on 401 errors
 */
export function registerLogoutCallback(callback: () => void) {
  logoutCallback = callback;
}

/**
 * Fetch wrapper with automatic 401 handling
 */
export async function fetchWithAuth(
  endpoint: string,
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const { skipAuthCheck, ...fetchOptions } = options;

  // Get token from localStorage
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('optichain_token')
    : null;

  // Get switched user ID for testing mode (User Switcher)
  const switchedUserId = typeof window !== 'undefined'
    ? localStorage.getItem('optichain_switched_user_id')
    : null;

  // Add Authorization header if token exists
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  if (token && !skipAuthCheck) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add X-Switch-User-Id header for testing mode
  // This allows testing different user permissions without re-authenticating
  if (switchedUserId) {
    headers['X-Switch-User-Id'] = switchedUserId;
  }

  // Make the request
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 Unauthorized
  if (response.status === 401 && !skipAuthCheck) {
    console.warn('[Auth] 401 Unauthorized - Session expired, logging out...');

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('optichain_auth');
      localStorage.removeItem('optichain_token');
    }

    // Call logout callback if registered
    if (logoutCallback) {
      logoutCallback();
    }

    // Redirect to signin with message
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const message = encodeURIComponent('Your session has expired. Please sign in again.');
      window.location.href = `/auth/signin?expired=true&message=${message}&redirect=${currentPath}`;
    }
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
export async function post(endpoint: string, body?: any, options?: FetchWithAuthOptions) {
  return fetchWithAuth(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Convenience method for PUT requests
 */
export async function put(endpoint: string, body?: any, options?: FetchWithAuthOptions) {
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
