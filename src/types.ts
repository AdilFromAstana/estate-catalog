export interface AppContextType {
  user: User | null;
  properties: PropertyResponse[];
  realtors: Realtor[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, org: string) => Promise<boolean>;
  logout: () => void;
  addProperty: (
    property: Omit<PropertyResponse, "id" | "createdAt" | "updatedAt">
  ) => void;
  // updateProperty: (id: string, updates: Partial<Property>) => void;
  // deleteProperty: (id: string) => void;
  loading: boolean;
}

export interface SelectedPropertyResponse extends PropertyResponse {
  selected: boolean;
}


/* -------------------------------------------------------------------------- */
/*                              Общие типы                                    */
/* -------------------------------------------------------------------------- */

export interface Coordinates {
  lat: number;
  lng: number;
}

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
  flatSecurityCodes?: string[];
  ceiling?: string;

  balcony?: string;
  parking?: string;
  furniture?: string;
  complex?: string;

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
  lastName: string
  phone: string
  avatar: string
  email: string
}

// Список свойств (объектов) в подборке
export interface SelectionProperties {
  data: PropertyResponse[];
  total: number;
  page: number;
  totalPages: number;
}

// Тип подборки
export type SelectionType = "byFilters" | "byIds" | "empty";

// Ответ от API для /selections/:id/properties
export interface SelectionResponse {
  selection: Selection;
  properties: SelectionProperties;
  type: SelectionType;
  createdBy: CreatedBy;
}

export interface Template {
  id: string;
  name: string;
  layout: LayoutItem[];
}

export interface LayoutItem {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UploadedImage {
  id: string;
  file: File;
  url: string;
}

// src/types/user.ts

export type UserRoleName = "realtor" | "agency_admin" | "admin";

export interface UserRole {
  id: number;
  name: UserRoleName;
  description?: string;
}

export interface Agency {
  id: number;
  name: string;
  phone?: string;
  bin?: string;
  kbe?: string;
  instagram?: string | null;
  tiktok?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  logo?: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  phone?: string;
  avatar?: string | null;
  instagram?: string | null;
  tiktok?: string | null;

  // связи
  agency?: Agency;
  agencyId?: number;

  // роли — теперь полноценные объекты
  roles: UserRole[];

  // статус и метаданные
  isLicensed?: boolean;
  isActive: boolean;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;

  // сервисные поля (опционально)
  refreshToken?: string | null;
  isAuthenticated?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  agencyId: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SelectionItem {
  id: number;
  name: string;
  description: string | null;
  isShared: boolean;
  createdAt: string;
  user: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    agency: { id: number; name: string };
  };
}

export interface SelectionTableAction {
  label: string;
  icon: React.ReactNode;
  onClick: (selection: SelectionItem) => void;
  visible?: (selection: SelectionItem) => boolean;
  color?: "blue" | "red" | "gray";
}

export interface SelectionsTableProps {
  selections: SelectionItem[];

  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onShare: (selection: SelectionItem) => void;

  visibleFilters: boolean;
  visibleActions: boolean;
  visiblePagination: boolean;

  currentPage?: number;
  total?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;

  actions?: SelectionTableAction[];
  filters?: React.ReactNode;
  pagination?: React.ReactNode;

  emptyText?: string;
}

export interface GetSelectionsParams {
  page?: number;
  limit?: number;
  isShared?: boolean;
  userId?: number;
  agencyId?: number;
}

export interface SelectionsListResponse {
  data: SelectionItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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

  buildingTypeCode?: string | null;
  flatRenovationCode?: string | null;
  flatParkingCode?: string | null;
  flatSecurityCodes?: string[];
  liveFurnitureCode?: string | null;
  flatToiletCode?: string | null;
  flatBalconyCode?: string | null;

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

export interface GetPropertiesParams {
  page?: number;
  limit?: number;
  type?: string; // PropertyType (enum на backend-е)
  status?: string; // PropertyStatus
  tags?: string[]; // PropertyTag[]

  cityId?: number;
  districtId?: number;
  complexId?: number;

  latitude?: number;
  longitude?: number

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

export interface City {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  cityId: number;
}


export interface MapInstance extends ymaps.Map { }
export interface PolygonInstance extends ymaps.Polygon { }
export interface PolylineInstance extends ymaps.Polyline { }

export interface DrawMapProps {
  estates: PropertyResponse[];
}

export interface MapContainerProps {
  estates: PropertyResponse[];
  setFiltered: (list: PropertyResponse[]) => void;
  polygon: PolygonInstance | null;
  setPolygon: (poly: PolygonInstance | null) => void;
}

export interface MapControlsProps {
  map: MapInstance | null;
  polygon: PolygonInstance | null;
  setPolygon: (p: PolygonInstance | null) => void;
  polyline: PolylineInstance | null;
  setPolyline: (l: PolylineInstance | null) => void;
  estates: PropertyResponse[];
  setFiltered: (list: PropertyResponse[]) => void;
  isDrawing: boolean;
  setIsDrawing: (v: boolean) => void;
}

export interface DrawingToolProps {
  map: MapInstance | null;
  ymaps: typeof ymaps | null;
  isDrawing: boolean;
  estates: PropertyResponse[];
  polygon: PolygonInstance | null;
  setPolygon: (poly: PolygonInstance | null) => void;
  setFiltered: (list: PropertyResponse[]) => void;
}

export interface PropertyListProps {
  filtered: PropertyResponse[];
  polygon: PolygonInstance | null;
}

export interface UseMapClustersProps {
  map: MapInstance | null;
  estates: PropertyResponse[];
  polygon: PolygonInstance | null;
  setFiltered: (list: PropertyResponse[]) => void;
}


export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

/** Модель жилого комплекса — должна совпадать с backend */
export interface Complex {
  id: number;
  name: string;
  address?: string;
  cityId?: number;
  districtId?: number;
  developer?: string;
  details?: Record<string, any>;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Ответ от findAll (с пагинацией) */
export interface ComplexListResponse {
  data: Complex[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FeatureItem {
  id: string | number;
  name: string;
}

export type FeatureList = FeatureItem[];

export type AllFeaturesData = Record<string, FeatureItem[]>;

// Результат одного API запроса (успешного)
export interface FeatureResultSuccess {
  status: "fulfilled";
  data: FeatureList;
}

// Ошибочный результат
export interface FeatureResultError {
  status: "rejected";
  reason: any;
}

// Объединённый тип для результата одного запроса
export type FeatureResult = FeatureResultSuccess | FeatureResultError;

// Все результаты сразу — "сырые" (из API)
export type AllFeaturesResultRaw = Record<string, FeatureResult>;

// Нормализованный тип — только успешные, без ошибок
export type AllFeaturesResultNormalized = Record<string, FeatureList>;

export interface Realtor {
  id: number | null;
  email: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  phone?: string;
  avatar?: string;
  instagram?: string;
  tiktok?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  isLicensed: boolean;
  isActive: boolean;
  isVerified: boolean;
  agencyId?: number | null;
  agency?: Agency; // 👈 лучше возвращать с бэка join-ом
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateRealtorDto = Partial<Omit<Realtor, "id">>;

export interface SelectionInfoCardProps {
  selection: any;
  total: number;
  createdBy: {
    firstName: string;
    lastName: string;
    phone: string;
    avatar: string;
  };
}

export interface ActivateToggleButtonProps {
  isActive: boolean;
  onConfirm: (newStatus: boolean) => void; // true = активировать, false = деактивировать
}

export interface DrawMapProps {
  estates: PropertyResponse[];
}

export interface LabeledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export interface PaginationProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number, mode: SelectionMode) => void;
  isLoading: boolean;
}

// Типы
export interface SelectionDetails {
  title: string;
  description: string;
  isPublic: boolean;
}

export type SelectionMode = 'filters' | 'manual';

export enum PropertyStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  RESERVED = "reserved",
  SOLD = "sold",
}

export interface PropertyStatusOption {
  value: PropertyStatus;
  label: string;
  color: string;
}