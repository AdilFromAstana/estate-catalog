// src/api/cityApi.ts
import axiosInstance from "./axiosInstance";

export interface City {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  cityId: number;
}

export const cityApi = {
  /**
   * Получить все города
   */
  getAllCities: async (): Promise<City[]> => {
    const res = await axiosInstance.get<City[]>("/locations/cities");
    return res.data;
  },

  /**
   * Получить районы по ID города
   */
  getDistrictsByCity: async (cityId: number): Promise<District[]> => {
    const res = await axiosInstance.get<District[]>(
      `/locations/cities/${cityId}/districts`
    );
    return res.data;
  },
};
