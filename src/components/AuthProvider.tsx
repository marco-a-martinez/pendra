'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import { LoginPage } from './LoginPage';
import { LoadingSpinner } from './LoadingSpinner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUser: setStoreUser } = useAppStore();

  useEffect(() => {
    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        // Set a timeout to ensure loading state doesn't hang
        const timeoutId = setTimeout(() => {
          console.warn('Auth session timeout, proceeding without session');
          setUser(null);
          setStoreUser(null);
          setLoading(false);
        }, 5000);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Clear timeout if we got a response
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('Auth session error:', error);
          setUser(null);
          setStoreUser(null);
        } else {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            // Database trigger handles user creation automatically
            
            setStoreUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
              avatar_url: session.user.user_metadata?.avatar_url,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at || session.user.created_at,
            });
          } else {
            setStoreUser(null);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth session error:', error);
        setUser(null);
        setStoreUser(null);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // User creation is handled in LoginPage signup
          
          setStoreUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at,
          });
        } else {
          setStoreUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [setStoreUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
