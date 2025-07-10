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
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Try to ensure user exists with fallback logic
          if (event === 'SIGNED_IN') {
            try {
              // Wait a moment for trigger to complete
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Check if user exists
              const { data: existingUser, error: selectError } = await supabase
                .from('users')
                .select('id')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (selectError) {
                console.error('Error checking user existence:', selectError);
              }
              
              // If user doesn't exist, create as fallback
              if (!existingUser && !selectError) {
                console.log('User not found, creating fallback record');
                const { error: insertError } = await supabase
                  .from('users')
                  .insert({
                    id: session.user.id,
                    email: session.user.email!,
                    name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
                    avatar_url: session.user.user_metadata?.avatar_url || null,
                  });
                
                if (insertError) {
                  console.error('Fallback user creation failed:', insertError);
                } else {
                  console.log('Fallback user creation successful');
                }
              }
            } catch (error) {
              console.error('Error in user creation fallback:', error);
            }
          }
          
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
