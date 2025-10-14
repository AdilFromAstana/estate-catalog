import type { GetSelectionsParams, SelectionItem, SelectionResponse } from "../types";
import axiosInstance from "./axiosInstance";

export const selectionApi = {
  // ➕ создать подборку
  createSelection: async (dto: any): Promise<any> => {
    const res = await axiosInstance.post("/selections", dto);
    return res.data;
  },

  // ✏️ обновить подборку
  updateSelection: async (id: number, dto: any): Promise<any> => {
    const res = await axiosInstance.put(`/selections/${id}`, dto);
    return res.data;
  },

  // 📃 получить все подборки (список)
  getAllSelections: async (
    params?: GetSelectionsParams
  ): Promise<{
    data: SelectionItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const res = await axiosInstance.get<{
      data: SelectionItem[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>(`/selections`, { params });
    return res.data;
  },

  getSelectionById: async (
    id: number,
    page: number = 1,
    limit: number = 10
  ): Promise<SelectionResponse> => {
    const res = await axiosInstance.get(`/selections/${id}`, {
      params: { page, limit },
    });
    return res.data;
  },
};
