import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { selectionApi } from "../api/selectionApi";
import type { GetSelectionsParams, SelectionResponse, SelectionsListResponse } from "../types";
import { useDebounce } from "./useDebounce";

/* -------------------------------------------------------------------------- */
/*                              📋 СПИСОК ПОДБОРОК                            */
/* -------------------------------------------------------------------------- */
export const useSelections = (params?: GetSelectionsParams) => {
  const debouncedParams = useDebounce(params, 400);
  return useQuery<SelectionsListResponse>({
    queryKey: ["selections", debouncedParams],
    queryFn: () => selectionApi.getAllSelections({ ...debouncedParams }),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

/* -------------------------------------------------------------------------- */
/*                              🧩 ОДНА ПОДБОРКА                              */
/* -------------------------------------------------------------------------- */
export const useSelection = (id: number) => {
  return useQuery<SelectionResponse>({
    queryKey: ["selection", id],
    queryFn: () => selectionApi.getSelectionById(id),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

/* -------------------------------------------------------------------------- */
/*                              🧩 ОБЪЕКТЫ ИЗ ПОДБОРКИ                        */
/* -------------------------------------------------------------------------- */
export const useSelectionWithInfiniteScroll = (id: number, enabled = true) => {
  return useInfiniteQuery<SelectionResponse>({
    queryKey: ['selection', id],
    queryFn: ({ pageParam }) => selectionApi.getSelectionById(id, pageParam as number, 10),
    initialPageParam: 1, // ← ОБЯЗАТЕЛЬНО в v5
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.properties;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/* -------------------------------------------------------------------------- */
/*                           ➕ СОЗДАНИЕ / ОБНОВЛЕНИЕ                          */
/* -------------------------------------------------------------------------- */
export const useCreateSelection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) => selectionApi.createSelection(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["selections"] });
    },
  });
};

export const useUpdateSelection = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) => selectionApi.updateSelection(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["selections"] });
      queryClient.invalidateQueries({ queryKey: ["selection", id] });
    },
  });
};
