import { useEffect, useState } from "react";
import { useCities, useDistricts } from "../hooks/useCities";
import {
  propertyApi,
  type PropertyResponse,
  type PropertyUpdateDto,
} from "../api/propertyApi";
import toast from "react-hot-toast";
import {
  getBuildingTypeLabels,
  getConditionLabels,
  useBuildingTypes,
  useConditions,
} from "./usePropertyDictionaries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useEditPropertyForm = (id: number, navigate: any) => {
  const queryClient = useQueryClient();
  const { data: cities = [] } = useCities();
  const [selectedCityId, setSelectedCityId] = useState<number>(0);
  const { data: districts = [] } = useDistricts(selectedCityId || undefined);
  const { data: buildingTypes = [] } = useBuildingTypes();
  const { data: conditions = [] } = useConditions();

  const buildingTypeLabels = getBuildingTypeLabels(buildingTypes);
  const conditionLabels = getConditionLabels(conditions);

  const [formData, setFormData] = useState<PropertyUpdateDto | null>(null);

  // загрузка объекта для редактирования
  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => propertyApi.getById(id),
    enabled: !!id,
  });

  // обновление
  const updateMutation = useMutation({
    mutationFn: (dto: PropertyUpdateDto) => propertyApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProperties"] });
      toast.success("Объект обновлен!");
      navigate("/my-properties");
    },
    onError: (err: any) => {
      toast.error(err.message || "Ошибка при обновлении");
    },
  });

  // заполнить форму после загрузки
  useEffect(() => {
    if (property) {
      setFormData({
        ...property,
      });
      setSelectedCityId(property.cityId ?? 0);
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      if (!formData.title || !formData.price) {
        toast.error("Заполните обязательные поля");
        return;
      }
      updateMutation.mutate({ ...formData, cityId: selectedCityId });
    } catch (err: any) {
      toast.error(err.message || "Ошибка при обновлении");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  return {
    formData,
    setFormData,
    selectedCityId,
    setSelectedCityId,
    handleSubmit,
    handleInputChange,
    cities,
    districts,
    buildingTypes,
    conditions,
    isSubmitting: updateMutation.isPending,
    isLoading,
  };
};
