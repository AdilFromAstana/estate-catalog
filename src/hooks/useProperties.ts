import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import {
  propertyApi,
  type BaseProperty,
  type GetPropertiesParams,
  type ParsedPropertyData,
  type PropertyCreateDto,
} from "../api/propertyApi";
import { useDebounce } from "./useDebounce";

// === Получить список объектов ===
export const useProperties = (params?: GetPropertiesParams) => {
  const debouncedParams = useDebounce(params, 400);

  return useQuery({
    queryKey: ["properties", debouncedParams],
    queryFn: () => propertyApi.getAll(debouncedParams),
    placeholderData: keepPreviousData, // 👈 теперь правильно для v5
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

export const useMyProperties = (
  userId: number,
  page: number,
  limit: number,
  params?: GetPropertiesParams
) => {
  return useProperties({ ...params, ownerId: userId, limit, page });
};

export const useToggleVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) =>
      propertyApi.updateVisibility(id, isPublished),
    onSuccess: () => {
      // Инвалидируем все списки properties
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
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
    queryFn: ({ signal }) => propertyApi.previewLink(url!, signal), // ✅ передаём signal
    enabled: !!isValidUrl,
    staleTime: 1000 * 60 * 5,
    gcTime: 0, // очищаем кеш при анмаунте
  });
};
