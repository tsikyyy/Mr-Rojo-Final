import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthState } from '../types';
import { authService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [error, setError] = useState<string | null>(null);

  // Vérifier le token au démarrage
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authService.setToken(token);
      // Récupérer l'utilisateur actuel
      authService.getCurrentUser()
        .then(user => {
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      authService.setToken(response.token);
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
