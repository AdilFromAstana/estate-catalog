import type { AuthResponse, LoginDto, RegisterDto } from "../types";
import axiosInstance from "./axiosInstance";

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
