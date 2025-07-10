'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';

// Tailwind v4 compatible login design - 2025-07-10T04:20:00.000Z

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  // Check for URL error parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlError = urlParams.get('error');
    if (urlError) {
      setError(decodeURIComponent(urlError));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (isSignUp && password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) {
          console.error('Signup error:', error);
          setError(error.message);
        } else if (data.user) {
          console.log('Signup successful:', data.user.id);
          setSuccess('Account created successfully! You can now sign in.');
          setTimeout(() => {
            setIsSignUp(false);
            setSuccess(null);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
          }, 2000);
        } else {
          setError('Signup completed but no user data returned.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(error.message);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pendra</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl" style={{ padding: '24px' }}>
          {/* Tab Switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg mb-6" style={{ padding: '4px' }}>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
                setSuccess(null);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className={`flex-1 text-sm font-medium transition-colors ${
                !isSignUp
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              style={{ padding: '8px 12px', borderRadius: '6px' }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
                setSuccess(null);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className={`flex-1 text-sm font-medium transition-colors ${
                isSignUp
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              style={{ padding: '8px 12px', borderRadius: '6px' }}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg" style={{ padding: '12px' }}>
                {error}
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm rounded-lg" style={{ padding: '12px' }}>
                {success}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300" style={{ marginBottom: '4px' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                style={{ padding: '8px 12px' }}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300" style={{ marginBottom: '4px' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                style={{ padding: '8px 12px' }}
                placeholder={isSignUp ? 'Create password (6+ chars)' : 'Enter password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300" style={{ marginBottom: '4px' }}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  style={{ padding: '8px 12px' }}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{ padding: '10px 16px', gap: '8px' }}
            >
              {loading && <LoadingSpinner className="w-4 h-4" />}
              <span>
                {loading
                  ? (isSignUp ? 'Creating Account...' : 'Signing In...')
                  : (isSignUp ? 'Create Account' : 'Sign In')
                }
              </span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center" style={{ marginTop: '24px' }}>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By continuing, you agree to our{' '}
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
