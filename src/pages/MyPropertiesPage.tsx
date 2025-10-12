import React, { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AppContext";
import { useMyProperties, useToggleVisibility } from "../hooks/useProperties";
import {
  PROPERTY_STATUS_OPTIONS,
  PropertyStatus,
} from "../contants/property-status";
import { PropertyTable } from "../components/PropertyTable/PropertyTable";
import toast from "react-hot-toast";
import type { PropertyResponse } from "../api/propertyApi";

const MyPropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<PropertyStatus | undefined>(undefined);
  const itemsPerPage = 8;

  if (!user?.id) return null;

  // ✅ Получаем только свои объекты
  const { data, isLoading } = useMyProperties(
    user.id,
    currentPage,
    itemsPerPage,
    { status }
  );
  const properties = data?.data || [];
  const total = data?.total || 0;

  // ✅ Тоггл видимости
  const { mutate: toggleVisibilityMutation } = useToggleVisibility();

  const handleEdit = useCallback(
    (id: number) => navigate(`/edit-property/${id}`),
    [navigate]
  );

  const handleDelete = useCallback((id: number) => {
    toast.success(`Объект ID ${id} удалён (демо-режим)`);
  }, []);

  const handleToggleVisibility = useCallback(
    (property: PropertyResponse) => {
      const newStatus = !property.isPublished;
      toggleVisibilityMutation(
        { id: property.id, isPublished: newStatus },
        {
          onSuccess: () =>
            toast.success(
              `Объект "${property.title}" теперь ${
                newStatus ? "опубликован" : "скрыт"
              }`
            ),
          onError: () => toast.error("Ошибка при изменении публикации"),
        }
      );
    },
    [toggleVisibilityMutation]
  );

  if (isLoading) {
    return (
      <div className="p-6 text-gray-600 flex items-center justify-center">
        Загрузка ваших объектов...
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-0 bg-gray-50">
      {/* Заголовок + кнопка */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Мои объекты ({properties.length} из {total})
        </h1>
        <button
          onClick={() => navigate("/add-property")}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" /> Добавить объект
        </button>
      </div>

      {/* Таблица с моими объектами */}
      <PropertyTable
        properties={properties}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleVisibility={handleToggleVisibility}
        visibleFilters={true}
        visibleActions={true}
        visiblePagination={true}
        // ⚙️ только фильтр по статусу
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <select
                value={status || ""}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                      ? (e.target.value as PropertyStatus)
                      : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">Все</option>
                {PROPERTY_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        }
        // ⚙️ Пагинация
        currentPage={currentPage}
        total={total}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default MyPropertiesPage;
