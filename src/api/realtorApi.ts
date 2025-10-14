import type { Realtor, UpdateRealtorDto } from "../types";
import axiosInstance from "./axiosInstance";

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

  uploadAvatar: async (id: string | number, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<{ url: string }>(
      `/users/${id}/avatar`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.url;
  },

  toggleStatus: async (id: number | string, isActive: boolean) => {
    const response = await axiosInstance.patch(`/users/${id}/status`, {
      isActive,
    });
    return response.data;
  },
};
