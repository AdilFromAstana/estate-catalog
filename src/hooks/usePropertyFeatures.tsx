import { useQuery } from "@tanstack/react-query";
import { propertyFeaturesApi } from "../api/propertyFeaturesApi";
import { useEffect, useState } from "react";
import type { AllFeaturesResultNormalized } from "../types";

export const usePropertyFeatures = () => {
    return useQuery({
        queryKey: ["property-features"],
        queryFn: propertyFeaturesApi.getAllFeatures,
        staleTime: 1000 * 60 * 10, // кэш 10 минут
    });
};

export function useAllFeatures() {
    const [data, setData] = useState<AllFeaturesResultNormalized>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        propertyFeaturesApi.getAllFeatures().then(raw => {
            const filtered: AllFeaturesResultNormalized = {};

            Object.entries(raw).forEach(([key, value]) => {
                if (value.status === "fulfilled") {
                    filtered[key] = value.data;
                }
            });

            setData(filtered);
            setLoading(false);
        });
    }, []);

    return { data, loading };
}
