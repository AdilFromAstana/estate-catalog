// src/api/propertyApi.ts
import axiosInstance from "./axiosInstance";

// Типы данных — адаптируй под твою сущность Property в NestJS
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AgentInfo {
  id: string;
  name: string;
  phone?: string;
  avatar?: string;
}

export interface AgencyInfo {
  id: string;
  name: string;
  logo?: string;
  phone?: string;
}

export type PropertyStatus = "sale" | "rent" | "hidden";
export type PropertyCategory = "apartment" | "house" | "commercial";

export interface PropertyCreateDto {
  title: string;
  description: string;
  type:
    | "apartment"
    | "house"
    | "commercial"
    | "land"
    | "garage"
    | "office"
    | "warehouse"
    | "cottage";
  status:
    | "active"
    | "inactive"
    | "sold"
    | "rented"
    | "reserved"
    | "under_construction";
  city: string;
  cityId: number;
  district: string;
  districtId: number;
  address: string;
  // street?: string;        // ← раскомментируй, если есть в DTO
  // houseNumber?: string;   // ← раскомментируй, если есть в DTO
  latitude?: number;
  longitude?: number;
  area: number;
  rooms: number;
  floor: number;
  totalFloors: number;
  price: number;
  currency?: string;
  photos?: string[]; // ← или images?
  mainPhoto?: string;
  hasBalcony?: boolean;
  hasParking?: boolean;
  yearBuilt?: number;
  condition: string;
  isExclusive: boolean;
  views: number;
  priority: number;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  status: string;
  type: string; // или 'apartment' | 'house' | ...
  city: string;
  cityId: number;
  district: string;
  districtId: number;
  address: string;
  street: string;
  houseNumber: string;
  area: number; // totalArea
  rooms: number; // roomCount
  floor: number;
  totalFloors: number;
  condition: string;
  isPublished: boolean;
  isExclusive: boolean;
  newBuilding?: boolean;
  amenities: string[];
  photos: string[];
  latitude?: number;
  longitude?: number;
  yearBuilt: number;
  coordinates: { lat: number; lng: number };
  agency: {
    id: number;
    name: string;
    logo?: string;
  };
  owner: {
    id: number;
    name: string;
    avatar?: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetPropertiesParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  cityId?: string;
  districtId?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  rooms?: number;
}

export interface PropertyResponse extends PropertyCreateDto {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Сервис для работы с объектами недвижимости
export const propertyApi = {
  /**
   * Создать новый объект недвижимости
   */
  create: async (dto: PropertyCreateDto): Promise<PropertyResponse> => {
    const response = await axiosInstance.post<PropertyResponse>(
      "/properties",
      dto
    );
    return response.data;
  },

  /**
   * Получить список объектов (опционально — для будущего использования)
   */
  getAll: async (
    params?: GetPropertiesParams
  ): Promise<{ data: Property[]; total: number }> => {
    const response = await axiosInstance.get<{
      data: Property[];
      total: number;
    }>("/properties", {
      params,
    });
    return response.data;
  },

  /**
   * Получить объект по ID
   */
  getById: async (id: number): Promise<Property> => {
    const response = await axiosInstance.get<Property>(`/properties/${id}`);
    return response.data;
  },

  /**
   * Обновить объект
   */
  update: async (
    id: string,
    dto: Partial<PropertyCreateDto>
  ): Promise<PropertyResponse> => {
    const response = await axiosInstance.patch<PropertyResponse>(
      `/properties/${id}`,
      dto
    );
    return response.data;
  },

  /**
   * Удалить объект
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/properties/${id}`);
  },
};

export const formatPrice = (amount: any) => {
  const num = Number(amount);
  if (isNaN(num)) return "₸";
  return `${Math.floor(num).toLocaleString()} ₸`;
};
