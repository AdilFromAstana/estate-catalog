import type { User } from "../types/user";
import axiosInstance from "./axiosInstance";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  agencyId: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authApi = {
  login: (dto: LoginDto) =>
    axiosInstance
      .post<AuthResponse>("/auth/login", dto)
      .then((res) => res.data),

  register: (dto: RegisterDto) =>
    axiosInstance.post("/auth/register", dto).then((res) => res.data),

  refresh: (refreshToken: string) =>
    axiosInstance
      .post<AuthResponse>("/auth/refresh", { refreshToken })
      .then((res) => res.data),

  logout: (refreshToken: string) =>
    axiosInstance.post("/auth/logout", { refreshToken }),
};
