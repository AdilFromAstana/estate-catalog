import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

export function useBuildingTypes() {
  return useQuery<string[]>({
    queryKey: ["buildingTypes"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/properties/dictionaries/building-types"
      );
      return res.data;
    },
    staleTime: Infinity, // ✅ кеш без протухания
    gcTime: Infinity, // ✅ хранить бесконечно
  });
}

export function useConditions() {
  return useQuery<string[]>({
    queryKey: ["conditions"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/properties/dictionaries/conditions"
      );
      return res.data;
    },
    staleTime: Infinity, // ✅ кеш без протухания
    gcTime: Infinity, // ✅ хранить бесконечно
  });
}

export function usePropertyStatuses() {
  return useQuery<string[]>({
    queryKey: ["propertyStatuses"],
    queryFn: async () => {
      const res = await axiosInstance.get("/properties/dictionaries/statuses");
      return res.data;
    },
    staleTime: Infinity, // ✅ кеш без протухания
    gcTime: Infinity, // ✅ хранить бесконечно
  });
}
