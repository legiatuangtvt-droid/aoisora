'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { registerLogoutCallback } from '@/lib/api/fetchWithAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface AuthUser {
  id: number;
  staffCode?: string;
  email: string;
  phone?: string;
  fullName: string;
  role: string;
  position?: string;
  storeId?: number;
  storeName?: string;
  departmentId?: number;
  departmentName?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkPasswordStrength: (password: string) => Promise<{ strength: string; score: number; feedback: string[] }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'optichain_auth';
const TOKEN_STORAGE_KEY = 'optichain_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

        if (savedToken && savedAuth) {
          try {
            const authData = JSON.parse(savedAuth);

            // Verify token with backend
            const response = await fetch(`${API_URL}/auth/me`, {
              headers: {
                'Authorization': `Bearer ${savedToken}`,
                'Accept': 'application/json',
              }
            });

            if (!response.ok) {
              throw new Error('Token expired or invalid');
            }

            const data = await response.json();

            if (data.success && data.user) {
              // Update user data from backend
              const authUser: AuthUser = {
                id: data.user.id,
                staffCode: data.user.staff_code,
                email: data.user.email,
                phone: data.user.phone,
                fullName: data.user.full_name,
                role: data.user.role,
                position: data.user.position,
                storeId: data.user.store_id,
                storeName: data.user.store_name,
                departmentId: data.user.department_id,
                departmentName: data.user.department_name,
                avatarUrl: data.user.avatar_url,
              };

              setUser(authUser);
              setToken(savedToken);

              // Update localStorage with fresh data
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: authUser }));
            } else {
              throw new Error('Invalid user data');
            }
          } catch (error) {
            console.warn('[Auth] Token verification failed:', error);
            // Clear invalid session
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            setUser(null);
            setToken(null);
          }
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (
    identifier: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
          remember_me: rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Login failed'
        };
      }

      const authUser: AuthUser = {
        id: data.user.id,
        staffCode: data.user.staff_code,
        email: data.user.email,
        phone: data.user.phone,
        fullName: data.user.full_name,
        role: data.user.role,
        position: data.user.position,
        storeId: data.user.store_id,
        storeName: data.user.store_name,
        departmentId: data.user.department_id,
        departmentName: data.user.department_name,
        avatarUrl: data.user.avatar_url,
      };

      setUser(authUser);
      setToken(data.access_token);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: authUser }));
        localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    // TODO: Implement Google OAuth
    return { success: false, error: 'Google sign in is not available yet.' };
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
      router.push('/auth/signin');
    }
  };

  // Register logout callback for 401 error handling
  useEffect(() => {
    registerLogoutCallback(() => {
      setUser(null);
      setToken(null);
    });
  }, []);

  const checkPasswordStrength = async (password: string): Promise<{ strength: string; score: number; feedback: string[] }> => {
    try {
      const response = await fetch(`${API_URL}/auth/check-password-strength`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        return {
          strength: data.strength,
          score: data.score,
          feedback: data.feedback,
        };
      }
    } catch (error) {
      console.error('Password strength check error:', error);
    }

    // Fallback to client-side check
    return calculatePasswordStrengthClient(password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        checkPasswordStrength,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Client-side password strength calculation (fallback)
function calculatePasswordStrengthClient(password: string): { strength: string; score: number; feedback: string[] } {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 1;
  else feedback.push('Password should be at least 8 characters');

  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Add numbers');

  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push('Add special characters (@$!%*?&)');

  let strength: string;
  if (score <= 2) strength = 'weak';
  else if (score <= 4) strength = 'medium';
  else strength = 'strong';

  return { strength, score, feedback };
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
