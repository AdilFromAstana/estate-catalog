// src/types/user.ts

export type UserRoleName = "realtor" | "agency_admin" | "admin";

export interface UserRole {
  id: number;
  name: UserRoleName;
  description?: string;
}

export interface Agency {
  id: number;
  name: string;
  phone?: string;
  bin?: string;
  kbe?: string;
  instagram?: string | null;
  tiktok?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  logo?: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  phone?: string;
  avatar?: string | null;
  instagram?: string | null;
  tiktok?: string | null;

  // связи
  agency?: Agency;
  agencyId?: number;

  // роли — теперь полноценные объекты
  roles: UserRole[];

  // статус и метаданные
  isLicensed?: boolean;
  isActive: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;

  // сервисные поля (опционально)
  refreshToken?: string | null;
  isAuthenticated?: boolean;
}
