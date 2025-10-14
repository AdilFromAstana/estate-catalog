
import type { AllFeaturesResultRaw, FeatureList, FeatureResultError, FeatureResultSuccess } from "../types";
import axiosInstance from "./axiosInstance";

export const propertyFeaturesApi = {
    // Список эндпойнтов
    getFlatSecurity: async (): Promise<FeatureList> => {
        const res = await axiosInstance.get<FeatureList>("/flat-security");
        return res.data;
    },
    getFlatBalcony: async (): Promise<FeatureList> => {
        const res = await axiosInstance.get<FeatureList>("/flat-balcony");
        return res.data;
    },
    getFlatDoor: async (): Promise<FeatureList> => {
        const res = await axiosInstance.get<FeatureList>("/flat-door");
        return res.data;
    },
    getFlatFlooring: async (): Promise<FeatureList> => {
        const res = await axiosInstance.get<FeatureList>("/flat-flooring");
        return res.data;
    },
    getFlatOptions: async (): Promise<FeatureList> => {
        const res = await axiosInstance.get<FeatureList>("/flat-options");
        return res.data;
    },
    getFlatParking: async (): Promise<FeatureList> => {
        const res = await axiosInstance.get<FeatureList>("/flat-parking");
        return res.data;
    },
    getFlatPhone: async (): Promise<FeatureList> => {
        const res = await axiosInstance.get<FeatureList>("/flat-phone");
        return res.data;
    },
    getFlatRenovation: async (): Promise<FeatureList> => {
        const res = await axiosInstance.get<FeatureList>("/flat-renovation");
        return res.data;
    },
    getFlatToilet: async (): Promise<FeatureList> => {
        const res = await axiosInstance.get<FeatureList>("/flat-toilet");
        return res.data;
    },
    getInetType: async (): Promise<FeatureList> => {
        const res = await axiosInstance.get<FeatureList>("/inet-type");
        return res.data;
    },
    getLiveFurniture: async (): Promise<FeatureList> => {
        const res = await axiosInstance.get<FeatureList>("/live-furniture");
        return res.data;
    },
    getFlatBuilding: async (): Promise<FeatureList> => {
        const res = await axiosInstance.get<FeatureList>("/flat-building");
        return res.data;
    },

    // Универсальный метод: все характеристики
    getAllFeatures: async (): Promise<AllFeaturesResultRaw> => {
        const entries = {
            FlatSecurity: propertyFeaturesApi.getFlatSecurity(),
            FlatBalcony: propertyFeaturesApi.getFlatBalcony(),
            FlatDoor: propertyFeaturesApi.getFlatDoor(),
            FlatFlooring: propertyFeaturesApi.getFlatFlooring(),
            FlatOptions: propertyFeaturesApi.getFlatOptions(),
            FlatParking: propertyFeaturesApi.getFlatParking(),
            FlatPhone: propertyFeaturesApi.getFlatPhone(),
            FlatRenovation: propertyFeaturesApi.getFlatRenovation(),
            FlatToilet: propertyFeaturesApi.getFlatToilet(),
            InetType: propertyFeaturesApi.getInetType(),
            LiveFurniture: propertyFeaturesApi.getLiveFurniture(),
            FlatBuilding: propertyFeaturesApi.getFlatBuilding(),
        };

        const results = await Promise.allSettled(Object.values(entries));
        const keys = Object.keys(entries);
        const final: AllFeaturesResultRaw = {};

        results.forEach((res, idx) => {
            const key = keys[idx];
            if (res.status === "fulfilled") {
                final[key] = {
                    status: "fulfilled",
                    data: res.value,
                } as FeatureResultSuccess;
            } else {
                final[key] = {
                    status: "rejected",
                    reason: res.reason,
                } as FeatureResultError;
            }
        });

        return final;
    },
};
