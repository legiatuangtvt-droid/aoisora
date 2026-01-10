'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');

  // Check for session expired message
  useEffect(() => {
    const expired = searchParams.get('expired');
    const message = searchParams.get('message');

    if (expired === 'true' && message) {
      setSessionExpiredMessage(decodeURIComponent(message));
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const isFormValid = emailOrPhone.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    const result = await login(emailOrPhone, password, rememberMe);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Sign in failed');
    }

    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);

    const result = await loginWithGoogle();

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Google sign in failed');
    }

    setIsSubmitting(false);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 via-sky-100 to-orange-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background with gradient sky and clouds */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-orange-200"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 100% 50% at 50% 100%, rgba(255, 200, 150, 0.6) 0%, transparent 50%),
            radial-gradient(ellipse 80% 40% at 20% 80%, rgba(255, 255, 255, 0.8) 0%, transparent 40%),
            radial-gradient(ellipse 60% 30% at 80% 85%, rgba(255, 255, 255, 0.7) 0%, transparent 35%),
            radial-gradient(ellipse 40% 20% at 30% 70%, rgba(255, 255, 255, 0.6) 0%, transparent 30%),
            radial-gradient(ellipse 50% 25% at 70% 75%, rgba(255, 255, 255, 0.5) 0%, transparent 30%)
          `
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-12 px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E3A5F] tracking-wide">
            AOI SORA
          </h1>
          <p className="text-[#1E3A5F]/70 text-lg mt-1">OptiChain</p>
        </div>

        {/* Sign In Card */}
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcom back</h2>
            <p className="text-gray-500 mt-1">Welcome back! Please enter your deatls</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email/Phone Field */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                name="username"
                autoComplete="username"
                placeholder="Email or Phone Number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                onInput={(e) => setEmailOrPhone(e.currentTarget.value)}
                className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-200 focus:border-[#1E3A5F] outline-none transition-colors bg-transparent text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(''); // Clear error when typing
                }}
                onInput={(e) => {
                  setPassword(e.currentTarget.value);
                  setError('');
                }}
                className={`w-full pl-10 pr-12 py-3 border-b-2 ${
                  error ? 'border-red-400' : 'border-gray-200 focus:border-[#1E3A5F]'
                } outline-none transition-colors bg-transparent text-gray-800 placeholder-gray-400`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Session Expired Warning */}
            {sessionExpiredMessage && !error && (
              <div className="bg-orange-50 border border-orange-300 rounded-lg p-3 flex items-start gap-2">
                <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-orange-800 text-sm font-medium">{sessionExpiredMessage}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-colors ${
                    rememberMe
                      ? 'bg-orange-500 border-orange-500'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {rememberMe && (
                      <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-2 text-sm text-gray-600">Remember for 30 days</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
              >
                Forgot password
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all mt-4 ${
                isFormValid && !isSubmitting
                  ? 'bg-[#1E3A5F] hover:bg-[#2d4a6f] cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center mt-6 text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-red-500 hover:text-red-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
