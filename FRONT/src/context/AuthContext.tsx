// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User } from '../context/AuthTypes';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAccessToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');

    console.log('Loading from localStorage:', { storedUser, storedAccessToken, storedRefreshToken });

    if (storedUser && storedAccessToken && storedRefreshToken) {
      try {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        refreshUser().finally(() => setLoading(false));
      } catch (error) {
        console.error('Erreur lors du parsing de localStorage:', error);
        logout();
        setLoading(false);
      }
    } else {
      console.log('Aucun token trouvé dans localStorage, utilisateur non connecté.');
      setLoading(false); // Pas de tokens, pas besoin de charger
    }
  }, []);

  const login = (userData: User, accessToken: string, refreshToken: string) => {
    setUser(userData);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    refreshUser().catch((error) => console.error('Erreur post-login:', error));
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setLoading(false);
  };

  const refreshUser = async () => {
    console.log('refreshUser called with:', { accessToken, refreshToken });
    if (!accessToken || !refreshToken) {
      console.log('Aucun token disponible pour rafraîchir l\'utilisateur');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/me/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('RefreshUser data:', data);
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        throw new Error('Erreur lors de la récupération des données utilisateur: ' + await response.text());
      }
    } catch (error) {
      console.error('Erreur lors de la validation de la session:', error);
      try {
        const refreshResponse = await fetch('http://localhost:8000/api/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setAccessToken(refreshData.access);
          localStorage.setItem('access_token', refreshData.access);
          await refreshUser(); // Relance refreshUser avec le nouveau token
        } else {
          console.warn('Rafraîchissement échoué, déconnexion imminente:', await refreshResponse.json());
          setTimeout(logout, 1000);
        }
      } catch (refreshError) {
        console.error('Erreur lors du rafraîchissement du token:', refreshError);
        setTimeout(logout, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, accessToken, refreshToken, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};