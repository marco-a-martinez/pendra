'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import { User } from '@/types';

interface AuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { setUser: setAppUser } = useAppStore();

  // Mock user for testing without authentication
  const mockUser: SupabaseUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'test@example.com',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {
      full_name: 'Test User',
      name: 'Test User',
      avatar_url: '',
    },
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const [user] = useState<SupabaseUser>(mockUser);

  useEffect(() => {
    // Set mock user in app store
    const appUser: User = {
      id: mockUser.id,
      email: mockUser.email || '',
      name: mockUser.user_metadata?.full_name || mockUser.user_metadata?.name || '',
      avatar_url: mockUser.user_metadata?.avatar_url || '',
      created_at: mockUser.created_at || new Date().toISOString(),
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
