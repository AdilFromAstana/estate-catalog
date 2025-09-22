// src/types/auth.ts
export type UserRole = 'admin' | 'realtor' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}