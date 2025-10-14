// src/services/authService.ts
import { authApi } from "../api/authApi";
import type { User } from "../types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

export const authService = {
  saveAuthData(access: string, refresh: string, user: User) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearAuthData() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      this.clearAuthData();
      return null;
    }
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const { accessToken, refreshToken, user } = await authApi.login({
        email,
        password,
      });
      this.saveAuthData(accessToken, refreshToken, user);
      return { success: true, user };
    } catch (err: any) {
      console.error("Ошибка логина:", err);
      this.clearAuthData();
      return {
        success: false,
        message:
          err.response?.status === 401
            ? "Неверный email или пароль"
            : err.response?.data?.message || "Ошибка при входе",
      };
    }
  },

  async refresh(): Promise<User | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;
    try {
      const {
        accessToken,
        refreshToken: newRefresh,
        user,
      } = await authApi.refresh(refreshToken);
      this.saveAuthData(accessToken, newRefresh, user);
      return user;
    } catch (err) {
      this.clearAuthData();
      return null;
    }
  },

  async logout() {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) await authApi.logout(refreshToken);
    this.clearAuthData();
  },
};
