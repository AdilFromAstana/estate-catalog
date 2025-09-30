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

const dictionaryLabels: Record<string, string> = {
  // BuildingType
  panel: "Панельный",
  brick: "Кирпичный",
  monolith: "Монолитный",
  monolith_brick: "Монолитно-кирпичный",
  wood: "Деревянный",
  block: "Блочный",

  // Condition
  needs_repair: "Требует ремонта",
  rough_finish: "Черновая отделка",
  fresh_renovation: "Свежий ремонт",
  tidy_renovation: "Не новый, но аккуратный ремонт",
  open_plan: "Свободная планировка",
};

export const getBuildingTypeLabels = (types: string[]): string[] => {
  return types
    .map((key) => dictionaryLabels[key] || key) // fallback на ключ, если нет перевода
    .filter(Boolean); // убираем пустые/undefined
};

/**
 * Преобразует массив ключей состояний в человекочитаемые названия
 */
export const getConditionLabels = (conditions: string[]): string[] => {
  return conditions.map((key) => dictionaryLabels[key] || key).filter(Boolean);
};
