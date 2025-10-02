// src/api/propertyApi.ts
import axiosInstance from "./axiosInstance";

export interface Coordinates {
  lat: number;
  lng: number;
}

export type PropertyType =
  | "apartment"
  | "house"
  | "commercial"
  | "land"
  | "garage"
  | "office"
  | "warehouse"
  | "cottage";

export type PropertyStatus =
  | "active"
  | "inactive"
  | "sold"
  | "rented"
  | "reserved"
  | "under_construction";

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

  coordinates?: Coordinates;

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
  ownerId?: number;
  agencyId?: number;
  page?: number;
  limit?: number;
  search?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  cityId?: number;
  districtId?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  minFloor?: number;
  maxFloor?: number;
  rooms?: number;
}

/**
 * 🔹 Данные, приходящие с Krisha.kz (парсер)
 */
export interface ParsedPropertyData {
  title: string;
  price: string;
  currency: string;
  address: string;
  city: string;
  district: string;
  street: string;
  houseNumber: string;
  area: string;
  kitchenArea: string;
  rooms: string;
  floorInfo: string;
  floor: string;
  totalFloors: string;
  buildingType: string;
  yearBuilt: string;
  condition: string;
  bathroom: string;
  balcony: string;
  parking: string;
  furniture: string;
  complex: string;
  description: string;
  photos: string[];
  sourceUrl: string;
  coordinates: string; // "lat,lng" или пустая строка
}

export const propertyApi = {
  create: async (dto: PropertyCreateDto): Promise<PropertyResponse> => {
    const res = await axiosInstance.post<PropertyResponse>("/properties", dto);
    return res.data;
  },

  getAll: async (
    params?: GetPropertiesParams
  ): Promise<{ data: PropertyResponse[]; total: number }> => {
    const res = await axiosInstance.get<{
      data: PropertyResponse[];
      total: number;
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

  previewLink: async (url: string) => {
    const res = await axiosInstance.get("/properties/preview", {
      params: { url },
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
  return `${Math.floor(num).toLocaleString()} ₸`;
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
