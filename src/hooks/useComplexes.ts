// src/hooks/useComplexes.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { complexApi } from "../api/complexApi";
import { useDebounce } from "./useDebounce";

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

export interface ComplexListResponse {
  data: Complex[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ComplexOption {
  id: number;
  name: string;
}

/**
 * Получить список ЖК с фильтрацией по cityId, districtId, developer и т.д.
 */
export const useComplexSearch = (q?: string) => {
  const debouncedQuery = useDebounce(q, 400);

  return useQuery({
    queryKey: ["complexSearch", debouncedQuery],
    queryFn: async (): Promise<ComplexOption[]> => {
      const { data } = await axiosInstance.get("/complexes/search", {
        params: { q: debouncedQuery },
      });
      return data;
    },
    enabled: !!debouncedQuery,
  });
};

export const useComplexes = (filters?: {
  cityId?: number;
  districtId?: number;
  search?: string;
  developer?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["complexes", filters],
    queryFn: async (): Promise<Complex[]> => {
      const { data } = await complexApi.getAll(filters);
      return data;
    },
  });
};

/**
 * Получить один ЖК по ID
 */
export const useComplex = (id?: number) => {
  return useQuery({
    queryKey: ["complex", id],
    queryFn: async (): Promise<Complex> => {
      const { data } = await axiosInstance.get<Complex>(`/complexes/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Поиск ЖК по названию (точное совпадение)
 */
export const useComplexByName = (name?: string) => {
  return useQuery({
    queryKey: ["complexByName", name],
    queryFn: async (): Promise<Complex> => {
      const { data } = await axiosInstance.get<Complex>(
        `/complexes/by-name/${encodeURIComponent(name || "")}`
      );
      return data;
    },
    enabled: !!name, // запрос выполняется только если имя указано
  });
};

/**
 * Создание нового ЖК
 */
export const useCreateComplex = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (complex: Omit<Complex, "id">) => {
      const { data } = await axiosInstance.post<Complex>("/complexes", complex);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complexes"] });
    },
  });
};

/**
 * Обновление ЖК
 */
export const useUpdateComplex = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: number; updates: Partial<Complex> }) => {
      const { id, updates } = params;
      const { data } = await axiosInstance.put<Complex>(
        `/complexes/${id}`,
        updates
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complexes"] });
    },
  });
};

/**
 * Удаление (деактивация) ЖК
 */
export const useDeleteComplex = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/complexes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complexes"] });
    },
  });
};
