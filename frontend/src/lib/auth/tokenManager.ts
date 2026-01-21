/**
 * Token Manager for Double Token System
 *
 * Manages access tokens (short-lived) and refresh tokens (long-lived)
 * with automatic token rotation and concurrent request queuing.
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp in milliseconds
}

interface RefreshResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

class TokenManager {
  private tokens: TokenPair | null = null;
  private refreshPromise: Promise<TokenPair> | null = null;
  private requestQueue: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
  }> = [];

  // Storage keys
  private static readonly REFRESH_TOKEN_KEY = 'optichain_refresh_token';
  private static readonly ACCESS_TOKEN_KEY = 'optichain_token'; // Keep backward compatibility

  /**
   * Initialize tokens from login response
   */
  setTokens(data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }): void {
    this.tokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    // Store refresh token in localStorage (for session restore)
    localStorage.setItem(TokenManager.REFRESH_TOKEN_KEY, data.refresh_token);

    // Also store access token for backward compatibility
    localStorage.setItem(TokenManager.ACCESS_TOKEN_KEY, data.access_token);
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    // First check in-memory tokens
    if (this.tokens?.accessToken) {
      return this.tokens.accessToken;
    }

    // Fallback to localStorage for backward compatibility
    return localStorage.getItem(TokenManager.ACCESS_TOKEN_KEY);
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return (
      this.tokens?.refreshToken ||
      localStorage.getItem(TokenManager.REFRESH_TOKEN_KEY)
    );
  }

  /**
   * Check if access token is expired or about to expire
   * Returns true if token needs refresh (30 seconds before actual expiry)
   */
  isAccessTokenExpired(): boolean {
    if (!this.tokens) {
      // If no tokens in memory, check localStorage
      const storedToken = localStorage.getItem(TokenManager.ACCESS_TOKEN_KEY);
      if (!storedToken) return true;

      // We don't have expiry info for legacy tokens, assume valid
      // The server will return 401 if invalid
      return false;
    }

    // Consider expired 30 seconds before actual expiry to prevent edge cases
    const bufferMs = 30 * 1000;
    return Date.now() >= this.tokens.expiresAt - bufferMs;
  }

  /**
   * Check if we have any tokens stored
   */
  hasTokens(): boolean {
    return !!(
      this.tokens?.accessToken ||
      localStorage.getItem(TokenManager.REFRESH_TOKEN_KEY) ||
      localStorage.getItem(TokenManager.ACCESS_TOKEN_KEY)
    );
  }

  /**
   * Refresh tokens using the refresh token
   * Implements concurrent request queuing - only one refresh at a time
   */
  async refreshTokens(): Promise<TokenPair> {
    // If refresh is already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Create refresh promise
    this.refreshPromise = this.doRefresh(refreshToken);

    try {
      const result = await this.refreshPromise;
      this.processQueue(null);
      return result;
    } catch (error) {
      this.processQueue(error as Error);
      throw error;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual refresh request
   */
  private async doRefresh(refreshToken: string): Promise<TokenPair> {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Check for token reuse or invalid token
        if (
          errorData.error_code === 'TOKEN_REUSE_DETECTED' ||
          errorData.error_code === 'INVALID_REFRESH_TOKEN'
        ) {
          // Security issue - clear all tokens
          this.clearTokens();
          throw new Error(
            errorData.message || 'Session expired. Please sign in again.'
          );
        }

        throw new Error(errorData.message || 'Failed to refresh tokens');
      }

      const data: RefreshResponse = await response.json();

      if (!data.success || !data.access_token || !data.refresh_token) {
        throw new Error('Invalid refresh response');
      }

      // Store new tokens
      this.setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      });

      return this.tokens!;
    } catch (error) {
      // Network error or other issues
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Wait for ongoing refresh to complete
   * Used by concurrent requests
   */
  waitForRefresh(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ resolve, reject });
    });
  }

  /**
   * Process queued requests after refresh completes
   */
  private processQueue(error: Error | null): void {
    this.requestQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    this.requestQueue = [];
  }

  /**
   * Clear all tokens (logout)
   */
  clearTokens(): void {
    this.tokens = null;
    localStorage.removeItem(TokenManager.REFRESH_TOKEN_KEY);
    localStorage.removeItem(TokenManager.ACCESS_TOKEN_KEY);
  }

  /**
   * Check if a refresh is currently in progress
   */
  isRefreshing(): boolean {
    return this.refreshPromise !== null;
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();
