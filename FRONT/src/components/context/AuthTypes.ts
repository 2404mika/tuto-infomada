// src/context/authTypes.ts
// import { ReactNode } from 'react';

export interface User {
  id: number;
  email: string;
  username: string;
  lastname: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (userData: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}