import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// Проверьте, что пути к этим файлам корректны относительно AgencySelectionsPage.jsx
import { SelectionsTable } from "../components/PropertyTable/SelectionsTable";
import { useSelections } from "../hooks/useSelection";
import { useAuth } from "../AppContext";
import { useRealtors } from "../hooks/useRealtor";

const AgencySelectionsPage: React.FC = () => {
  const navigate = useNavigate();
  // Предполагаем, что useAuth предоставляет информацию о текущем пользователе
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [filters, setFilters] = useState<{
    ownerId?: number;
    isShared?: boolean;
  }>({});

  const { data: realtors } = useRealtors(user?.agencyId!, 1, 100, {});
  const owners = realtors?.data ?? [];

  const { data: selectionsData, isLoading } = useSelections({
    page: currentPage,
    limit: pageSize,
    isShared: filters.isShared,
    agencyId: user?.agencyId,
    userId: filters.ownerId, // <-- Фильтр по ID владельца
  });

  const total = selectionsData?.total ?? 0;

  const handleEdit = useCallback(
    (id: number) => navigate(`/edit-selection/${id}`),
    [navigate]
  );

  const handleDelete = useCallback((id: number) => {
    // Эта функция будет выполняться после устранения ошибки компиляции
    toast.success(`Подборка ID ${id} удалена (демо-режим)`);
  }, []);

  const copyToClipboard = (text: string): Promise<void> => {
    if (navigator.clipboard && window.isSecureContext) {
      // Современный способ (работает только в HTTPS или localhost)
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback для HTTP или старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed'; // чтобы не прыгал скролл
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(textArea);
      }
      return Promise.resolve();
    }
  };

  const handleShare = useCallback(async (selection: any) => {
    try {
      const url = `${window.location.origin}/selections/${selection.id}`;
      await copyToClipboard(url);
      toast.success(`Ссылка скопирована: ${url}`);
    } catch (err) {
      toast.error('Не удалось скопировать ссылку');
    }
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Подборки агентсва ({selectionsData?.data.length ?? 0} из {total})
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
        filters={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 🔹 фильтр: общие / личные */}
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
                  setFilters((prev) => ({
                    ...prev, // Сохраняем ownerId
                    isShared:
                      value === ""
                        ? undefined
                        : value === "shared"
                          ? true
                          : false,
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">Все</option>
                <option value="shared">Общие</option>
                <option value="private">Личные</option>
              </select>
            </div>
            {/* 🔹 фильтр: Риэлтор */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Риэлтор
              </label>
              <select
                // Используем filters.ownerId для значения
                value={filters.ownerId ?? ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    // Обновляем ownerId в фильтрах
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
        currentPage={currentPage}
        total={total}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AgencySelectionsPage;
