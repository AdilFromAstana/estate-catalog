// src/api/complexApi.ts
import axiosInstance from "./axiosInstance";

/** Модель жилого комплекса — должна совпадать с backend */
export interface Complex {
  id: number;
  name: string;
  address?: string;
  cityId?: number;
  districtId?: number;
  developer?: string;
  details?: Record<string, any>;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Ответ от findAll (с пагинацией) */
export interface ComplexListResponse {
  data: Complex[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const complexApi = {
  /**
   * Получить все ЖК (с поиском и фильтрами)
   * @param params параметры фильтрации (cityId, search, developer и т.п.)
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    cityId?: number;
    districtId?: number;
    developer?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  }): Promise<ComplexListResponse> => {
    const res = await axiosInstance.get<ComplexListResponse>("/complexes", {
      params,
    });
    return res.data;
  },

  /**
   * Найти ЖК по ID
   */
  getById: async (id: number): Promise<Complex> => {
    const res = await axiosInstance.get<Complex>(`/complexes/${id}`);
    return res.data;
  },

  /**
   * Найти ЖК по точному названию
   */
  getByName: async (name: string): Promise<Complex> => {
    const res = await axiosInstance.get<Complex>(
      `/complexes/by-name/${encodeURIComponent(name)}`
    );
    return res.data;
  },

  /**
   * Создать новый ЖК
   */
  create: async (data: Omit<Complex, "id">): Promise<Complex> => {
    const res = await axiosInstance.post<Complex>("/complexes", data);
    return res.data;
  },

  /**
   * Обновить ЖК
   */
  update: async (id: number, data: Partial<Complex>): Promise<Complex> => {
    const res = await axiosInstance.put<Complex>(`/complexes/${id}`, data);
    return res.data;
  },

  /**
   * Удалить (деактивировать) ЖК
   */
  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/complexes/${id}`);
  },
};

export const normalizeKrishaText = (text: string): string => {
  return text
    .replace(/Перевести[\s\S]*/gi, "")
    .replace(/Перевод может быть неточным/gi, "")
    .replace(/Показать оригинал/gi, "")
    .replace(/Translate[\s\S]*/gi, "")
    .replace(/Show original/gi, "")
    .trim();
};
