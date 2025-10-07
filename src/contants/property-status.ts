// src/constants/property-status.ts

export enum PropertyStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  RESERVED = "reserved",
  SOLD = "sold",
}

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  [PropertyStatus.DRAFT]: "Черновик",
  [PropertyStatus.ACTIVE]: "Активно продаётся",
  [PropertyStatus.RESERVED]: "Забронировано",
  [PropertyStatus.SOLD]: "Продано",
};

export const PROPERTY_STATUS_COLORS: Record<PropertyStatus, string> = {
  [PropertyStatus.DRAFT]: "gray",
  [PropertyStatus.ACTIVE]: "green",
  [PropertyStatus.RESERVED]: "orange",
  [PropertyStatus.SOLD]: "blue",
};
