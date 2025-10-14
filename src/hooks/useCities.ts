import { useQuery } from "@tanstack/react-query";
import { cityApi, } from "../api/cityApi";
import type { City, District } from "../types";

// === Получить все города ===
export const useCities = () => {
  return useQuery<City[]>({
    queryKey: ["cities"],
    queryFn: () => cityApi.getAllCities(),
    staleTime: Infinity, // ✅ кеш без протухания
    gcTime: Infinity, // ✅ хранить бесконечно
  });
};

// === Получить районы конкретного города ===
export const useDistricts = (cityId?: number) => {
  return useQuery<District[]>({
    queryKey: ["districts", cityId],
    queryFn: () => {
      if (!cityId) return Promise.resolve([] as District[]);
      return cityApi.getDistrictsByCity(cityId);
    },
    enabled: !!cityId, // запрос делается только если cityId есть
    staleTime: Infinity, // ✅ кеш без протухания
    gcTime: Infinity, // ✅ хранить бесконечно
  });
};
