// src/api/propertyApi.ts
import type { GetPropertiesParams, ParsedPropertyData, PropertyCreateDto, PropertyResponse, PropertyUpdateDto } from "../types";
import axiosInstance from "./axiosInstance";

export const propertyApi = {
  create: async (dto: PropertyCreateDto): Promise<PropertyResponse> => {
    const res = await axiosInstance.post<PropertyResponse>("/properties", dto);
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
