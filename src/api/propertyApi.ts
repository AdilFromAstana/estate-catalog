// src/api/propertyApi.ts
import type { PropertyStatus } from "../contants/property-status";
import type { SelectionResponse } from "../types/property";
import axiosInstance from "./axiosInstance";

export type PropertyType =
  | "apartment"
  | "house"
  | "commercial"
  | "land"
  | "garage"
  | "office"
  | "warehouse"
  | "cottage";

export type Currency = "KZT" | "USD" | "EUR";

/**
 * Базовые поля недвижимости (общие)
 */
export interface BaseProperty {
  title: string;
  description: string;

  type: PropertyType;
  status: PropertyStatus;

  price: number;
  currency?: Currency;

  city: string;
  cityId: number;
  district: string;
  districtId: number;
  street?: string;
  houseNumber?: string;
  address?: string;

  area: number;
  kitchenArea?: number;
  rooms: number;
  bathrooms?: number;

  floor?: number;
  totalFloors?: number;

  buildingType?: string;
  condition?: string;
  yearBuilt?: number;

  balcony?: string;
  parking?: string;
  furniture?: string;
  complex?: string;
  latitude?: number;
  longitude?: number;

  photos: string[];
  mainPhoto?: string;

  isPublished?: boolean;
  isExclusive?: boolean;
}

/**
 * 🔹 DTO для создания (отправляем на бэкенд)
 */
export interface PropertyCreateDto extends BaseProperty {
  importUrl?: string;
}

/**
 * 🔹 DTO для обновления (частичные поля)
 */
export type PropertyUpdateDto = Partial<PropertyCreateDto>;

/**
 * 🔹 DTO для ответа от API (чтение)
 * Содержит все поля + системные
 */
export interface PropertyResponse extends BaseProperty {
  id: number;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: number;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
  };
  agency?: {
    id: number;
    name: string;
    logo?: string;
  };
}

/**
 * 🔹 Параметры фильтрации/поиска
 */
export interface GetPropertiesParams {
  page?: number;
  limit?: number;
  type?: string; // PropertyType (enum на backend-е)
  status?: string; // PropertyStatus
  tags?: string[]; // PropertyTag[]

  cityId?: number;
  districtId?: number;
  complexId?: number;

  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  minFloor?: number;
  maxFloor?: number;
  minCeiling?: number;
  maxCeiling?: number;

  buildingTypeCodes?: string[];
  flatRenovationCodes?: string[];
  flatParkingCodes?: string[];
  flatSecurityCodes?: string[];
  liveFurnitureCodes?: string[];
  flatToiletCodes?: string[];
  flatBalconyCodes?: string[];

  rooms?: number;
  isPublished?: boolean;

  agencyId?: number;
  ownerId?: number;

  sortBy?: "price" | "area" | "createdAt";
  sortOrder?: "ASC" | "DESC";
}

/**
 * 🔹 Данные, приходящие с Krisha.kz (парсер)
 */
export interface ParsedPropertyData {
  id?: number;
  title: string;
  description: string | null;

  // Локация
  city: string;
  cityId?: number;
  district: string;
  districtId?: number;
  address: string | null;
  latitude?: number | null;
  longitude?: number | null;
  coordinates?: string; // "lat,lng" — для совместимости с UI

  // Комплекс / здание
  complex?: string;
  complexId?: number | null;
  buildingTypeCode?: string | null; // "brick", "panel" и т.д.
  flatRenovationCode?: string | null; // "rough_finish", "euro", и т.п.
  flatParkingCode?: string | null;
  flatSecurityCodes?: string[];
  liveFurnitureCode?: string | null;
  flatToiletCode?: string | null;
  flatBalconyCode?: string | null;

  // Параметры объекта
  ceiling?: string | null;
  area: number;
  rooms: number;
  floor: number;
  totalFloors: number;
  yearBuilt?: number | null;
  type?: string; // "apartment", "house", etc.

  // Финансы
  price: number;
  currency: string;

  // Статус / публикация
  status?: string; // "draft", "active", etc.
  isPublished?: boolean;

  // Мета-инфо
  importUrl?: string | null;
  photos: string[];

  // Владельцы / агентство
  ownerId?: number;
  agencyId?: number;

  // Соцсети
  instagramPost?: string | null;
  tiktokVideo?: string | null;

  // Теги и служебные поля
  tags?: string[] | null;
  createdAt?: string;
  updatedAt?: string;
}

export const propertyApi = {
  create: async (dto: PropertyCreateDto): Promise<PropertyResponse> => {
    const res = await axiosInstance.post<PropertyResponse>("/properties", dto);
    return res.data;
  },

  createSelection: async (dto: any): Promise<any> => {
    const res = await axiosInstance.post<any>("/selections", dto);
    return res.data;
  },

  updateSelection: async (id: number, dto: any): Promise<any> => {
    const res = await axiosInstance.put<any>(`/selections/${id}`, dto);
    return res.data;
  },

  getSelectionById: async (id: number): Promise<SelectionResponse> => {
    const res = await axiosInstance.get(`/selections/${id}`);
    return res.data;
  },

  getAll: async (
    params?: GetPropertiesParams
  ): Promise<{
    data: PropertyResponse[];
    page: string;
    limit: string;
    total: number;
    totalPages: number;
  }> => {
    const res = await axiosInstance.get<{
      data: PropertyResponse[];
      page: string;
      limit: string;
      total: number;
      totalPages: number;
    }>("/properties", { params });
    return res.data;
  },

  getById: async (id: number): Promise<PropertyResponse> => {
    const res = await axiosInstance.get<PropertyResponse>(`/properties/${id}`);
    return res.data;
  },

  update: async (
    id: number,
    dto: PropertyUpdateDto
  ): Promise<PropertyResponse> => {
    const res = await axiosInstance.put<PropertyResponse>(
      `/properties/${id}`,
      dto
    );
    return res.data;
  },

  updateVisibility: async (
    id: number,
    isPublished: boolean
  ): Promise<PropertyResponse> => {
    const res = await axiosInstance.put<PropertyResponse>(`/properties/${id}`, {
      isPublished: isPublished,
    });
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/properties/${id}`);
  },

  importFromKrisha: async (url: string): Promise<ParsedPropertyData> => {
    const res = await axiosInstance.post<ParsedPropertyData>(
      "/properties/parse",
      { url }
    );
    return res.data;
  },

  previewLink: async (url: string, signal?: AbortSignal) => {
    const res = await axiosInstance.get("/properties/preview", {
      params: { url },
      signal, // 👈 вот так добавляем поддержку отмены
    });
    return res.data as {
      title: string;
      description: string;
      image: string;
      url: string;
    };
  },
};

/**
 * 🔹 Форматирование цены
 */
export const formatPrice = (amount: any) => {
  const num = Number(amount);
  if (isNaN(num)) return "₸";
  return `${Math.floor(num).toLocaleString()}`;
};

export const normalizeCurrency = (
  val: string
): "KZT" | "USD" | "EUR" | undefined => {
  if (!val) return undefined;
  if (val.includes("〒") || val.toLowerCase().includes("kzt")) return "KZT";
  if (val.toLowerCase().includes("usd") || val.includes("$")) return "USD";
  if (val.toLowerCase().includes("eur") || val.includes("€")) return "EUR";
  return undefined;
};

export const parseCoordinates = (val: string): { lat: number; lng: number } => {
  if (!val) return { lat: 0, lng: 0 };
  const [lat, lng] = val.split(",").map((n) => parseFloat(n.trim()));
  return {
    lat: isNaN(lat) ? 0 : lat,
    lng: isNaN(lng) ? 0 : lng,
  };
};

export const formatFullName = (owner: {
  firstName?: string;
  lastName?: string;
}) => {
  if (!owner) return "-";

  const lastName = owner.lastName ?? "";
  const firstName = owner.firstName ?? "";

  const fullName = `${lastName} ${firstName}`.trim();
  return fullName || "-";
};

export const formatRooms = (rooms: number): string => {
  if (rooms === 0) return "Студия";
  if (rooms === 1) return "1 к.";
  if (rooms >= 2) return `${rooms} к.`;
  return `${rooms} к.`; // Более краткий формат для таблицы
};
