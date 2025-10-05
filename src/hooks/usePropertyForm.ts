import { useEffect, useState } from "react";
import { useImportProperty } from "../hooks/useProperties";
import { useCities, useDistricts } from "../hooks/useCities";
import {
  normalizeCurrency,
  parseCoordinates,
  propertyApi,
  type ParsedPropertyData,
  type PropertyCreateDto,
} from "../api/propertyApi";
import toast from "react-hot-toast";
import {
  getBuildingTypeLabels,
  getConditionLabels,
  useBuildingTypes,
  useConditions,
} from "./usePropertyDictionaries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useComplexes } from "./useComplexes";

export const usePropertyForm = (_: any, navigate: any) => {
  const queryClient = useQueryClient();
  const importMutation = useImportProperty();
  const { data: cities = [] } = useCities();
  const [selectedCityId, setSelectedCityId] = useState<number>(0);
  const [complexName, setComplexName] = useState<string>("");
  const [selectedComplexId, setSelectedComplexId] = useState<number>(0);
  const { data: districts = [] } = useDistricts(selectedCityId || undefined);
  const { data: complexes = [] } = useComplexes({
    search: complexName || "",
  });
  const { data: buildingTypes = [] } = useBuildingTypes();
  const { data: conditions = [] } = useConditions();

  const buildingTypeLabels = getBuildingTypeLabels(buildingTypes);
  const conditionLabels = getConditionLabels(conditions);

  const [formData, setFormData] = useState<PropertyCreateDto>({
    title: "",
    description: "",
    price: 0,
    area: 0,
    rooms: 0,
    bathrooms: 0,
    type: "apartment",
    status: "active",
    photos: [],
    city: "",
    cityId: 0,
    district: "",
    districtId: 0,
    street: "",
    houseNumber: "",
    floor: 0,
    totalFloors: 0,
    condition: "",
    buildingType: "",
    yearBuilt: 0,
    balcony: "",
    parking: "",
    furniture: "",
    complex: "",
    kitchenArea: 0,
    coordinates: { lat: 0, lng: 0 },
  });

  const [parsedData, setParsedData] = useState<ParsedPropertyData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: propertyApi.create,
    onSuccess: () => {
      // ⚡️ сброс кэша, чтобы MyPropertiesPage обновился
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Объект добавлен!");
      navigate("/my-properties");
    },
    onError: (err: any) => {
      toast.error(err.message || "Ошибка при добавлении");
    },
  });

  const handleImport = (
    e: React.FormEvent,
    opts?: { onSuccess?: () => void; onError?: (err: Error) => void }
  ) => {
    e.preventDefault();
    if (!formData.importUrl) {
      setImportError("Введите URL объявления Krisha.kz");
      return;
    }
    setImportError(null);
    setParsedData(null);

    importMutation.mutate(formData.importUrl, {
      onSuccess: (data) => {
        setParsedData(data);

        const matchedCity = cities.find(
          (c) => c.name.toLowerCase() === data.city.toLowerCase()
        );
        // 🔍 Найти buildingType по label (русскому названию)
        const buildingTypeIndex = buildingTypeLabels.findIndex(
          (label) => label.toLowerCase() === data.buildingType?.toLowerCase()
        );
        const conditionIndex = conditionLabels.findIndex(
          (label) => label.toLowerCase() === data.condition?.toLowerCase()
        );

        setComplexName(data.complex);

        const matchedBuildingType =
          buildingTypeIndex !== -1 ? buildingTypes[buildingTypeIndex] : "";
        const matchedCondition =
          conditionIndex !== -1 ? conditions[conditionIndex] : "";

        console.log(matchedBuildingType);
        console.log("conditions: ", conditions);
        console.log("conditionLabels: ", conditionLabels);
        console.log("matchedCondition: ", matchedCondition);
        console.log("conditionIndex: ", conditionIndex);

        setFormData((prev) => ({
          ...prev,
          ...data,
          cityId: matchedCity?.id || 0,
          city: matchedCity?.name || data.city,
          // временно districtId = 0 (заполним позже)
          districtId: 0,
          district: data.district,
          price: parseFloat(data.price) || 0,
          area: parseFloat(data.area) || 0,
          rooms: parseInt(data.rooms) || 0,
          floor: parseInt(data.floor) || 0,
          totalFloors: parseInt(data.totalFloors) || 0,
          yearBuilt: parseInt(data.yearBuilt) || 0,
          kitchenArea: parseFloat(data.kitchenArea) || 0,
          currency: normalizeCurrency(data.currency),
          coordinates: parseCoordinates(data.coordinates),
          buildingType: matchedBuildingType,
        }));

        if (matchedCity) {
          setSelectedCityId(matchedCity.id);
        }

        opts?.onSuccess?.();
      },
      onError: (err) => {
        const message = err.message || "Ошибка импорта";
        setImportError(message);
        opts?.onError?.(err);
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.title || !formData.price) {
        toast.error("Заполните обязательные поля");
        return;
      }

      createMutation.mutate({ ...formData, cityId: selectedCityId });
      toast.success("Объект добавлен!");
      navigate("/my-properties");
    } catch (err: any) {
      toast.error(err.message || "Ошибка при добавлении");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleResetImport = () => {
    setParsedData(null);
    setFormData((prev: any) => ({
      ...prev,
      importUrl: "",
      title: "",
      description: "",
      price: 0,
      photos: [],
    }));
  };

  useEffect(() => {
    if (!complexes?.length || !complexName) return;

    const matchedComplex = complexes.find(
      (c) => c.name.trim().toLowerCase() === complexName.trim().toLowerCase()
    );

    if (matchedComplex) {
      setSelectedComplexId(matchedComplex.id);
      setFormData((prev) => ({
        ...prev,
        complexId: matchedComplex.id,
        complex: matchedComplex.name,
      }));
    } else {
      setSelectedComplexId(0);
    }
  }, [complexes, complexName]);

  useEffect(() => {
    if (!parsedData || !districts.length || !selectedCityId) return;

    const matchedDistrict = districts.find(
      (d) =>
        d.name.toLowerCase() === parsedData.district.toLowerCase().split(" ")[0]
    );

    if (matchedDistrict) {
      setFormData((prev) => ({
        ...prev,
        districtId: matchedDistrict.id,
        district: matchedDistrict.name,
      }));
    }
  }, [parsedData, districts, selectedCityId]);

  return {
    formData,
    setFormData,
    selectedCityId,
    setSelectedCityId,
    parsedData,
    setParsedData,
    importError,
    setImportError,
    handleImport,
    handleSubmit,
    handleResetImport,
    handleInputChange,
    importMutation,
    cities,
    districts,
    buildingTypes,
    conditions,
    isSubmitting: createMutation.isPending,
    complexes,
  };
};
