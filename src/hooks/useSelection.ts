import { useQuery } from "@tanstack/react-query";
import { propertyApi } from "../api/propertyApi";
import type { SelectionResponse } from "../types/property";

export const useSelection = (id: number) => {
  return useQuery<SelectionResponse>({
    queryKey: ["selection", id],
    queryFn: () => propertyApi.getSelectionByIdPublic(id),
    enabled: !!id,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
