'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useAppStore } from '@/lib/store';
import { User } from '@/types';

interface AuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

// Mock user for development without authentication
const MOCK_USER: SupabaseUser = {
  id: 'mock-user-id',
  app_metadata: {},
  user_metadata: {
    full_name: 'Test User',
    name: 'Test User',
    avatar_url: '',
  },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email: 'test@example.com',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  identities: [],
  factors: [],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<SupabaseUser>(MOCK_USER);
  const [loading, setLoading] = useState(true);
  const { setUser: setAppUser } = useAppStore();

  useEffect(() => {
    // Set mock user immediately
    const appUser: User = {
      id: MOCK_USER.id,
      email: MOCK_USER.email || '',
      name: MOCK_USER.user_metadata?.full_name || MOCK_USER.user_metadata?.name || 'Test User',
      avatar_url: MOCK_USER.user_metadata?.avatar_url || '',
      created_at: MOCK_USER.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setAppUser(appUser);
    setLoading(false);
  }, [setAppUser]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
