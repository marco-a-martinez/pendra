'use client';

import { createContext, useContext } from 'react';

interface AuthContextType {
  user: null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: false });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Temporary: bypass authentication entirely
  return (
    <AuthContext.Provider value={{ user: null, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}
