import { PropertyStatus, type PropertyStatusOption } from "../types";

export const PROPERTY_STATUS_OPTIONS: PropertyStatusOption[] = [
  {
    value: PropertyStatus.DRAFT,
    label: "Черновик",
    color: "gray",
  },
  {
    value: PropertyStatus.ACTIVE,
    label: "Активно",
    color: "green",
  },
  {
    value: PropertyStatus.RESERVED,
    label: "Забронировано",
    color: "orange",
  },
  {
    value: PropertyStatus.SOLD,
    label: "Продано",
    color: "blue",
  },
];

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  [PropertyStatus.DRAFT]: "Черновик",
  [PropertyStatus.ACTIVE]: "Активно",
  [PropertyStatus.RESERVED]: "Забронировано",
  [PropertyStatus.SOLD]: "Продано",
};

export const PROPERTY_STATUS_COLORS: Record<PropertyStatus, string> = {
  [PropertyStatus.DRAFT]: "gray",
  [PropertyStatus.ACTIVE]: "green",
  [PropertyStatus.RESERVED]: "orange",
  [PropertyStatus.SOLD]: "blue",
};
