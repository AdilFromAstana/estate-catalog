import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { selectionApi } from "../api/selectionApi";
import type { GetSelectionsParams, SelectionResponse, SelectionsListResponse } from "../types";

/* -------------------------------------------------------------------------- */
/*                              📋 СПИСОК ПОДБОРОК                            */
/* -------------------------------------------------------------------------- */
export const useSelections = (params?: GetSelectionsParams) => {
  return useQuery<SelectionsListResponse>({
    queryKey: ["selections", params],
    queryFn: async () => {
      const query = new URLSearchParams({
        ...(params?.page ? { page: String(params.page) } : {}),
        ...(params?.limit ? { limit: String(params.limit) } : {}),
        ...(params?.isShared !== undefined
          ? { isShared: String(params.isShared) }
          : {}),
        ...(params?.userId ? { userId: String(params.userId) } : {}),
        ...(params?.agencyId ? { agencyId: String(params.agencyId) } : {}),
      });
      return await selectionApi.getAllSelections(query.toString());
    },
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
