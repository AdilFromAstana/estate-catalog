import type { Selection, SelectionResponse } from "../types";
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

  // 🔍 получить одну подборку по ID
  getSelectionById: async (id: number): Promise<SelectionResponse> => {
    const res = await axiosInstance.get(`/selections/${id}`);
    return res.data;
  },

  // 📃 получить все подборки (список)
  getAllSelections: async (
    query?: string
  ): Promise<{
    data: Selection[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const res = await axiosInstance.get(`/selections?${query ?? ""}`);
    return res.data;
  },
};
