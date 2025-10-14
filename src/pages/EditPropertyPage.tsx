import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useProperty, useUpdateProperty } from "../hooks/useProperties";
import { useCities, useDistricts } from "../hooks/useCities";
import { useComplexes } from "../hooks/useComplexes";
import { PropertyEditForm } from "../components/PropertyEditForm";

const EditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const propertyId = Number(id);

  // 🔹 Хуки данных
  const { data: property, isLoading } = useProperty(propertyId);
  const updateMutation = useUpdateProperty(propertyId);
  const { data: cities = [] } = useCities();
  //const { data: buildingTypes = [] } = useBuildingTypes();
  //const { data: conditions = [] } = useConditions();
  const buildingTypes: string[] = [];
  const conditions: string[] = [];

  const [selectedCityId, setSelectedCityId] = useState<number>(0);
  const { data: districts = [] } = useDistricts(selectedCityId || undefined);
  const { data: complexes = [] } = useComplexes({
    search: "",
  });

  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (property) {
      setFormData(property);
      setSelectedCityId(property.cityId);
    }
  }, [property]);

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (!formData.title || !formData.price) {
      toast.error("Заполните обязательные поля");
      return;
    }

    updateMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Объект успешно обновлён");
        navigate("/my-properties");
      },
      onError: (err: any) => {
        toast.error(err.message || "Ошибка при обновлении");
      },
    });
  };

  if (isLoading || !formData) {
    return (
      <div className="text-center py-10 text-gray-500">
        Загрузка данных объекта...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <PropertyEditForm
        updateMutation={updateMutation}
        setFormData={setFormData}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        navigate={navigate}
        cities={cities}
        districts={districts}
        selectedCityId={selectedCityId}
        setSelectedCityId={setSelectedCityId}
        buildingTypes={buildingTypes}
        conditions={conditions}
        complexes={complexes}
      />
    </div>
  );
};

export default EditPropertyPage;
