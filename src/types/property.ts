// src/types/property.ts
import type { PropertyStatus } from "../contants/property-status";

/* -------------------------------------------------------------------------- */
/*                              Общие типы                                    */
/* -------------------------------------------------------------------------- */

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

export type Currency = "KZT" | "USD" | "EUR";

/* -------------------------------------------------------------------------- */
/*                            Базовая недвижимость                            */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                             DTO и ответы API                               */
/* -------------------------------------------------------------------------- */

export interface PropertyCreateDto extends BaseProperty {
  importUrl?: string;
}

export type PropertyUpdateDto = Partial<PropertyCreateDto>;

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

/* -------------------------------------------------------------------------- */
/*                             Параметры фильтрации                           */
/* -------------------------------------------------------------------------- */

export interface GetPropertiesParams {
  page?: number;
  limit?: number;
  type?: string; // PropertyType
  status?: string; // PropertyStatus
  tags?: string[];

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

/* -------------------------------------------------------------------------- */
/*                          Парсинг с Krisha.kz                               */
/* -------------------------------------------------------------------------- */

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
  coordinates?: string; // "lat,lng"

  // Комплекс / здание
  complex?: string;
  complexId?: number | null;
  buildingTypeCode?: string | null;
  flatRenovationCode?: string | null;
  flatParkingCode?: string | null;
  flatSecurityCodes?: string[];
  liveFurnitureCode?: string | null;
  flatToiletCode?: string | null;
  flatBalconyCode?: string | null;

  // Параметры
  ceiling?: string | null;
  area: number;
  rooms: number;
  floor: number;
  totalFloors: number;
  yearBuilt?: number | null;
  type?: string;

  // Финансы
  price: number;
  currency: string;

  // Статус
  status?: string;
  isPublished?: boolean;

  // Мета
  importUrl?: string | null;
  photos: string[];

  // Владельцы / агентство
  ownerId?: number;
  agencyId?: number;

  // Соцсети
  instagramPost?: string | null;
  tiktokVideo?: string | null;

  // Теги
  tags?: string[] | null;
  createdAt?: string;
  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                                Подборки                                    */
/* -------------------------------------------------------------------------- */
// Фильтры для динамической подборки
export interface SelectionFilters {
  rooms?: number;
  cityId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  [key: string]: any; // на случай новых фильтров
}

// Основная модель подборки
export interface Selection {
  id: number;
  name: string;
  description?: string | null;
  filters?: SelectionFilters | null;
  propertyIds?: number[] | null;
  isShared: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Кто создал подборку
export interface CreatedBy {
  id: number;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  avatar?: string | null;
  email?: string | null;
}

// Список свойств (объектов) в подборке
export interface SelectionProperties {
  data: PropertyResponse[];
  total: number;
  page?: number;
  totalPages?: number;
}

// Тип подборки
export type SelectionType = "byFilters" | "byIds" | "empty";

// Ответ от API для /selections/:id/properties
export interface SelectionResponse {
  selection: Selection;
  properties: SelectionProperties;
  type: SelectionType;
  createdBy?: CreatedBy;
}
