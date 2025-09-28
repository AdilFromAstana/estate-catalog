// src/hooks/useRealtor.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  realtorApi,
  type Realtor,
  type UpdateRealtorDto,
} from "../api/realtorApi";

// Ключи для кеша
const realtorKeys = {
  all: ["realtors"] as const,
  list: (agencyId: string | number, page: number, limit: number) =>
    [...realtorKeys.all, agencyId, page, limit] as const,
  detail: (id: string | number) => [...realtorKeys.all, id] as const,
};

// Получение данных по id
export const useRealtors = (
  agencyId: string | number,
  page: number,
  limit: number,
  filters: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortDirection?: string;
  }
) =>
  useQuery({
    queryKey: ["realtors", agencyId, page, limit, filters],
    queryFn: () => realtorApi.getByAgency(agencyId, page, limit, filters),
  });

export const useRealtor = (id: string | number) =>
  useQuery<Realtor>({
    queryKey: realtorKeys.detail(id),
    queryFn: () => realtorApi.getById(String(id)),
    enabled: !!id, // запрос выполняется только если есть id
    staleTime: Infinity, // ✅ кеш без протухания
    gcTime: Infinity, // ✅ хранить бесконечно
  });

// Обновление данных
export const useUpdateRealtor = (id: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateRealtorDto) => realtorApi.update(String(id), dto),
    onSuccess: (data) => {
      // обновляем кеш для этого риелтора
      queryClient.setQueryData(realtorKeys.detail(id), data);
    },
  });
};

export const getStatusClass = (isActive: boolean, isVerified: boolean) => {
  if (!isActive) return "bg-red-100 text-red-800";
  if (!isVerified) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
};

export const getStatusText = (isActive: boolean, isVerified: boolean) => {
  if (!isActive) return "Неактивный";
  if (!isVerified) return "На проверке";
  return "Активный";
};
