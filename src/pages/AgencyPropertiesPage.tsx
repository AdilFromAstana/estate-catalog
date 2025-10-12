import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AppContext";
import {
  useAgencyProperties,
  useToggleVisibility,
} from "../hooks/useProperties";
import { useRealtors } from "../hooks/useRealtor";
import {
  PROPERTY_STATUS_OPTIONS,
  PropertyStatus,
} from "../contants/property-status";
import toast from "react-hot-toast";
import { PropertyTable } from "../components/PropertyTable/PropertyTable";
import type { PropertyResponse } from "../api/propertyApi";

const AgencyPropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    status?: PropertyStatus;
    ownerId?: number;
  }>({});

  const itemsPerPage = 8;

  // ✅ Получаем объекты агентства
  const { data: propertiesData, isLoading } = useAgencyProperties(
    user?.agencyId!,
    {
      page: currentPage,
      limit: itemsPerPage,
      status: filters.status,
      ownerId: filters.ownerId,
    }
  );

  const total = propertiesData?.total ?? 0;

  // ✅ Получаем риэлторов агентства (для фильтра)
  const { data: realtorsData } = useRealtors(user?.agencyId!, 1, 100, {
    status: "active",
  });
  const owners = realtorsData?.data ?? [];

  // ✅ Мутация: опубликовать / скрыть
  const { mutate: toggleVisibilityMutation } = useToggleVisibility();

  const handleDelete = useCallback((id: number) => {
    toast.success(`Объект ID ${id} помечен на удаление (демо-режим)`);
  }, []);

  const handleEdit = useCallback(
    (id: number) => navigate(`/edit-property/${id}`),
    [navigate]
  );

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
        Загрузка объектов...
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-0 bg-gray-50">
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Объекты агентства ({propertiesData?.data.length ?? 0} из {total})
        </h1>
      </div>

      {/* Таблица */}
      <PropertyTable
        properties={propertiesData?.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleVisibility={handleToggleVisibility}
        visibleFilters={true} // фильтры включены
        visibleActions={true} // админ может всё
        visiblePagination={true} // есть страницы
        // ⚙️ Фильтры
        status={filters.status}
        onStatusChange={(status) => setFilters((prev) => ({ ...prev, status }))}
        // ✅ Фильтр по риэлтору (добавляем кастомно)
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Статус
              </label>
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value
                      ? (e.target.value as PropertyStatus)
                      : undefined,
                  }))
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Риэлтор
              </label>
              <select
                value={filters.ownerId ?? ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    ownerId: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">Все</option>
                {owners.map((o: any) => (
                  <option key={o.id} value={o.id}>
                    {o.firstName} {o.lastName}
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

export default AgencyPropertiesPage;
