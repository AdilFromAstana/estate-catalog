import { useEffect, useState } from "react";
import { useImportProperty } from "../hooks/useProperties";
import { useCities, useDistricts } from "../hooks/useCities";
import {
  propertyApi,
} from "../api/propertyApi";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useComplexes } from "./useComplexes";
import { PropertyStatus, type ParsedPropertyData } from "../types";

export const usePropertyForm = (_: any, navigate: any) => {
  const queryClient = useQueryClient();
  const importMutation = useImportProperty();
  const { data: cities = [] } = useCities();
  const [selectedCityId, setSelectedCityId] = useState<number>(0);
  const [complexName] = useState<string>("");
  const { data: districts = [] } = useDistricts(selectedCityId || undefined);
  const { data: complexes = [] } = useComplexes({
    search: complexName || "",
  });
  //const { data: buildingTypes = [] } = useBuildingTypes();
  //const { data: conditions = [] } = useConditions();
  const buildingTypes: string[] = [];
  const conditions: string[] = [];

  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    price: 0,
    area: 0,
    rooms: 0,
    bathrooms: 0,
    type: "apartment",
    status: PropertyStatus.ACTIVE,
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
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (!formData.importUrl) {
      setImportError("Введите URL объявления Krisha.kz");
      return;
    }
    setImportError(null);
    setParsedData(null);

    importMutation.mutate(formData.importUrl);
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
      // setSelectedComplexId(matchedComplex.id);
      setFormData((prev: any) => ({
        ...prev,
        complexId: matchedComplex.id,
        complex: matchedComplex.name,
      }));
    } else {
      // setSelectedComplexId(0);
    }
  }, [complexes, complexName]);

  useEffect(() => {
    if (!parsedData || !districts.length || !selectedCityId) return;

    const matchedDistrict = districts.find(
      (d) =>
        d.name.toLowerCase() === parsedData.district.toLowerCase().split(" ")[0]
    );

    if (matchedDistrict) {
      setFormData((prev: any) => ({
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
