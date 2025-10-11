import type { PropertyResponse } from "./types/property";
import type { User } from "./types/user";

export interface Realtor {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  experience: number;
  propertiesSold: number;
  rating: number;
  description: string;
  status: "active" | "inactive" | "pending";
  joinedDate: string;
}

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
