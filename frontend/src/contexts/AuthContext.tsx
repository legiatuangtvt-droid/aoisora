'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: number;
  email: string;
  phone?: string;
  fullName: string;
  role: string;
  storeId?: number;
  storeName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'optichain_auth';
const REMEMBER_ME_KEY = 'optichain_remember';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuth) {
          try {
            const authData = JSON.parse(savedAuth);
            setUser(authData.user);
          } catch {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (
    emailOrPhone: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation - In production, this would be an API call
      // For demo: accept any email with password "Password123!"
      if (password === 'Password123!' || password.length >= 8) {
        const mockUser: AuthUser = {
          id: 1,
          email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@example.com`,
          phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
          fullName: 'Nguyen Van An',
          role: 'Store Leader',
          storeId: 1,
          storeName: 'AMPM_D1_NCT',
        };

        setUser(mockUser);

        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: mockUser }));
          if (rememberMe) {
            localStorage.setItem(REMEMBER_ME_KEY, 'true');
          }
        }

        return { success: true };
      } else {
        return { success: false, error: 'Incorrect password' };
      }
    } catch {
      return { success: false, error: 'An error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // TODO: Implement Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock Google login
      const mockUser: AuthUser = {
        id: 2,
        email: 'user@gmail.com',
        fullName: 'Google User',
        role: 'Staff',
        storeId: 1,
        storeName: 'AMPM_D1_NCT',
      };

      setUser(mockUser);

      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: mockUser }));
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Google sign in failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(REMEMBER_ME_KEY);
    }
    router.push('/auth/signin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
