'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';

// Fixed: Removed huge logos, removed OAuth, fixed database errors
// Cache bust: Force clean build - 2023-10-01T12:00:00.000Z

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Check for URL error parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlError = urlParams.get('error');
    if (urlError) {
      setError(decodeURIComponent(urlError));
      // Clean up URL
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

    try {
      setLoading(true);
      setError(null);

      if (isSignUp) {
        // Try a simpler approach - create user record first, then auth
        try {
          // First, try to sign up the user
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (error) {
            console.error('Signup error:', error);
            setError(`Signup failed: ${error.message}`);
          } else if (data.user) {
            console.log('Signup successful, user created:', data.user.id);
            
            // Create user record manually since we disabled the trigger
            try {
              const { error: userError } = await supabase
                .from('users')
                .insert({
                  id: data.user.id,
                  email: data.user.email!,
                  name: data.user.user_metadata?.full_name || null,
                  avatar_url: data.user.user_metadata?.avatar_url || null,
                });
              
              if (userError) {
                console.error('User record creation failed:', userError);
                setError('Account created but profile setup failed. Please contact support.');
              } else {
                console.log('User record created successfully');
                setError('Account created successfully! You can now sign in.');
              }
            } catch (err) {
              console.error('Unexpected error creating user record:', err);
              setError('Account created but profile setup failed. Please contact support.');
            }
          } else {
            setError('Signup completed but no user data returned.');
          }
        } catch (err) {
          console.error('Unexpected signup error:', err);
          setError('An unexpected error occurred. Please try again.');
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
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="mx-auto bg-blue-600 rounded-lg flex items-center justify-center mb-4" style={{width: '48px', height: '48px'}}>
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pendra
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Modern productivity, beautifully designed
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isSignUp ? 'Sign up to start organizing your tasks' : 'Sign in to continue'}
              </p>
            </div>

            {error && (
              <div className={`border rounded-md p-3 ${
                error.includes('Check your email') 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <p className={`text-sm ${
                  error.includes('Check your email')
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}>{error}</p>
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="input-field"
                  required
                />
              </div>
              {isSignUp && (
                <div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="input-field"
                    required
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : null}
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Free to use • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}
