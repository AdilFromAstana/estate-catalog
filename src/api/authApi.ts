// src/api/authApi.ts
import type { User } from "../types";
import axiosInstance from "./axiosInstance";

// === DTO ===
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  agencyId: number;
}

// === Ответы от бэкенда ===
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User; // ← добавляем данные пользователя
}

export interface RegisterResponse {
  message: string;
  user?: User; // опционально, если бэкенд возвращает
}

// === Внутренние утилиты ===
const saveAuthData = (
  accessToken: string,
  refreshToken: string,
  user: User
) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem(
    "user",
    JSON.stringify({ ...user, roles: user.roles.map((r: any) => r?.name) })
  );
};

const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

// === API-сервис ===
export const authApi = {
  /**
   * Вход в систему
   */
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/auth/login",
        dto
      );

      const { accessToken, refreshToken, user } = response.data;

      // Сохраняем данные
      saveAuthData(accessToken, refreshToken, {
        ...user,
        isAuthenticated: true,
      });

      return response.data;
    } catch (error: any) {
      // Очищаем данные при ошибке
      clearAuthData();
      throw error;
    }
  },

  /**
   * Регистрация нового пользователя
   */
  register: async (dto: RegisterDto): Promise<RegisterResponse> => {
    try {
      const response = await axiosInstance.post<RegisterResponse>(
        "/auth/register",
        dto
      );

      // Если бэкенд возвращает user — можно сразу залогинить
      if (response.data.user) {
        // Но обычно после регистрации требуется вход → не сохраняем токен
      }

      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Обновление access-токена
   */
  refresh: async (): Promise<AuthResponse | null> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
      const response = await axiosInstance.post<AuthResponse>("/auth/refresh", {
        refreshToken,
      });

      const {
        accessToken,
        refreshToken: newRefreshToken,
        user,
      } = response.data;

      // Обновляем токены
      saveAuthData(accessToken, newRefreshToken, {
        ...user,
        isAuthenticated: true,
      });

      return response.data;
    } catch (error) {
      // Если refresh не удался — разлогиниваем
      clearAuthData();
      return null;
    }
  },

  /**
   * Выход из системы
   */
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      // Опционально: уведомить бэкенд, чтобы инвалидировать токены
      if (refreshToken) {
        await axiosInstance.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.warn("Ошибка при выходе:", error);
    } finally {
      clearAuthData();
    }
  },

  /**
   * Получить текущего пользователя (из localStorage)
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr) as User;
      return {
        ...user,
        isAuthenticated: true,
      };
    } catch (e) {
      console.error("Ошибка парсинга пользователя из localStorage", e);
      clearAuthData();
      return null;
    }
  },
};
