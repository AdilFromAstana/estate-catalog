import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../AppContext";
import { usePropertyForm } from "../hooks/usePropertyForm";
import { propertyApi } from "../api/propertyApi";
import { PropertyEditForm } from "../components/PropertyEditForm";

const EditPropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useApp();

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const originalRef = useRef<any>(null);

  const {
    formData,
    setFormData,
    selectedCityId,
    setSelectedCityId,
    handleSubmit,
    handleInputChange,
    isSubmitting,
    cities,
    districts,
    buildingTypes,
    conditions,
  } = usePropertyForm(user, navigate);

  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      try {
        const property = await propertyApi.getById(Number(id));
        setFormData(property);
        setSelectedCityId(property.cityId ?? null);
        originalRef.current = property;
        setMode("view");
      } catch (e) {
        console.error("Ошибка загрузки объекта", e);
      } finally {
        setLoading(false);
      }
    };
    loadProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Загрузка...</div>;
  }

  const handleCancel = () => {
    if (originalRef.current) {
      setFormData(originalRef.current);
      setSelectedCityId(originalRef.current.cityId ?? null);
    }
    setMode("view");
  };

  const onSubmitWrapper = async (e: React.FormEvent) => {
    const maybePromise = handleSubmit(e);
    try {
      if (
        maybePromise &&
        typeof (maybePromise as Promise<any>).then === "function"
      ) {
        await (maybePromise as Promise<any>);
      }
      const fresh = await propertyApi.getById(Number(id));
      originalRef.current = fresh;
      setFormData(fresh);
      setSelectedCityId(fresh.cityId ?? null);
      setMode("view");
    } catch (err) {
      console.error("Ошибка сохранения", err);
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {mode === "view" ? (
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">{formData.title}</h1>
            <p className="text-gray-700 mb-2">Цена: {formData.price} ₸</p>
            <p className="text-gray-700 mb-2">
              Город: {cities.find((c) => c.id === formData.cityId)?.name}
            </p>

            {/* <div className="flex gap-2 mt-4">
              {formData.isHot && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                  🔥 Горячее
                </span>
              )}
              {formData.isSold && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  ✅ Продано
                </span>
              )}
              {formData.isMortgaged && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  ⚠️ В залоге
                </span>
              )}
            </div> */}

            <button
              onClick={() => setMode("edit")}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Редактировать
            </button>
          </div>
        ) : (
          <>
            <PropertyEditForm
              buildingTypes={buildingTypes}
              conditions={conditions}
              formData={formData}
              onChange={handleInputChange}
              onSubmit={onSubmitWrapper}
              isSubmitting={isSubmitting}
              navigate={navigate}
              cities={cities}
              districts={districts}
              selectedCityId={selectedCityId ?? null}
              setSelectedCityId={(id) => setSelectedCityId(id!)}
            />
            <button
              onClick={handleCancel}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Отмена
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditPropertyPage;
