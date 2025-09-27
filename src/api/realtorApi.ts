// src/api/realtorApi.ts
import axiosInstance from "./axiosInstance";

export interface Realtor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  agencyId: string;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateRealtorDto {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export const realtorApi = {
  getById: async (id: string): Promise<Realtor> => {
    const response = await axiosInstance.get<Realtor>(`/realtors/${id}`);
    return response.data;
  },

  update: async (id: string, dto: UpdateRealtorDto): Promise<Realtor> => {
    const response = await axiosInstance.patch<Realtor>(`/realtors/${id}`, dto);
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
