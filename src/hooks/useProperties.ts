import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  propertyApi,
  type BaseProperty,
  type GetPropertiesParams,
  type ParsedPropertyData,
  type PropertyCreateDto,
} from "../api/propertyApi";

// === Получить список объектов ===
export const useProperties = (params?: GetPropertiesParams) => {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => propertyApi.getAll(params),
    staleTime: Infinity, // ✅ кеш без протухания
    gcTime: Infinity, // ✅ хранить бесконечно
  });
};

export const useMyProperties = (
  userId: number,
  params?: GetPropertiesParams
) => {
  return useProperties({ ...params, ownerId: userId });
};

export const useAgencyProperties = (
  agencyId: number,
  params?: GetPropertiesParams
) => {
  return useProperties({ ...params, agencyId });
};

// === Получить объект по ID ===
export const useProperty = (id: number) => {
  return useQuery<BaseProperty>({
    queryKey: ["property", id],
    queryFn: () => propertyApi.getById(id),
    enabled: !!id, // не дёргать без id
    staleTime: Infinity, // ✅ кеш без протухания
    gcTime: Infinity, // ✅ хранить бесконечно
  });
};

// === Создать новый объект ===
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: PropertyCreateDto) => propertyApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

// === Обновить объект ===
export const useUpdateProperty = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: Partial<BaseProperty>) => propertyApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", id] });
    },
  });
};

// === Удалить объект ===
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => propertyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

export const useImportProperty = () => {
  return useMutation<ParsedPropertyData, Error, string>({
    mutationFn: (url: string) => propertyApi.importFromKrisha(url),
  });
};

export const useLinkPreview = (url?: string) => {
  const isValidUrl = url && /^https?:\/\/.+/i.test(url);

  return useQuery({
    queryKey: ["linkPreview", url],
    queryFn: () => propertyApi.previewLink(url!),
    enabled: !!isValidUrl, // запрос только если URL валидный
    staleTime: 1000 * 60 * 5,
  });
};
