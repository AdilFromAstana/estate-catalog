// src/api/realtorApi.ts
import axiosInstance from "./axiosInstance";
export interface Agency {
  id: number | null;
  name: string;
  email: string;
}

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

export const realtorApi = {
  getByAgency: async (
    agencyId: string | number,
    page: number,
    limit: number,
    filters: {
      search?: string;
      status?: string;
      sortBy?: string;
      sortDirection?: string;
    }
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(filters.search ? { search: filters.search } : {}),
      ...(filters.status && filters.status !== "all"
        ? { status: filters.status }
        : {}),
      ...(filters.sortBy ? { sortBy: filters.sortBy } : {}),
      ...(filters.sortDirection
        ? { sortDirection: filters.sortDirection }
        : {}),
    });

    const response = await axiosInstance.get(
      `/agencies/${agencyId}/users?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Realtor> => {
    const response = await axiosInstance.get<Realtor>(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, dto: UpdateRealtorDto): Promise<Realtor> => {
    const response = await axiosInstance.put<Realtor>(`/users/${id}`, dto);
    return response.data;
  },

  // Дополнительно: можно добавить uploadAvatar
  uploadAvatar: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axiosInstance.post<{ url: string }>(
      "/upload/avatar",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.url;
  },
};
