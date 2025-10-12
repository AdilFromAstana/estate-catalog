import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SelectionsTable } from "../components/PropertyTable/SelectionsTable";
import { useSelections } from "../hooks/useSelection";

const AdminSelectionsPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    isShared?: boolean;
  }>({});

  const itemsPerPage = 10;

  // ✅ получаем подборки агентства (или все, если админ)
  const { data: selectionsData, isLoading } = useSelections({
    page: currentPage,
    limit: itemsPerPage,
    isShared: filters.isShared,
  });

  const total = selectionsData?.total ?? 0;

  const handleEdit = useCallback(
    (id: number) => navigate(`/edit-selection/${id}`),
    [navigate]
  );

  const handleDelete = useCallback((id: number) => {
    toast.success(`Подборка ID ${id} удалена (демо-режим)`);
  }, []);

  const handleShare = useCallback((selection: any) => {
    const newShared = !selection.isShared;
    toast.success(
      `Подборка "${selection.name}" теперь ${
        newShared ? "общая" : "личная"
      } (демо-режим)`
    );
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 text-gray-600 flex items-center justify-center">
        Загрузка подборок...
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-0 bg-gray-50">
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Подборки ({selectionsData?.data.length ?? 0} из {total})
        </h1>
      </div>

      {/* Таблица */}
      <SelectionsTable
        selections={selectionsData?.data || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onShare={handleShare}
        visibleFilters={true}
        visibleActions={true}
        visiblePagination={true}
        // 🔹 фильтр: общие / личные
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип подборки
              </label>
              <select
                value={
                  filters.isShared === undefined
                    ? ""
                    : filters.isShared
                    ? "shared"
                    : "private"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setFilters({
                    isShared:
                      value === ""
                        ? undefined
                        : value === "shared"
                        ? true
                        : false,
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">Все</option>
                <option value="shared">Общие</option>
                <option value="private">Личные</option>
              </select>
            </div>
          </div>
        }
        // 🔹 пагинация
        currentPage={currentPage}
        total={total}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminSelectionsPage;
