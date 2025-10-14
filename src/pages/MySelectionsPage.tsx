import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SelectionsTable } from "../components/PropertyTable/SelectionsTable";
import { useSelections } from "../hooks/useSelection";
import { Plus } from "lucide-react";
import { useAuth } from "../AppContext";

const MySelectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    isShared?: boolean;
  }>({});

  const itemsPerPage = 10;

  const { data: selectionsData, isLoading } = useSelections({
    page: currentPage,
    limit: itemsPerPage,
    isShared: filters.isShared,
    userId: user?.id
  });

  const total = selectionsData?.total ?? 0;

  const handleEdit = useCallback(
    (id: number) => navigate(`/edit-selection/${id}`),
    [navigate]
  );

  const handleDelete = useCallback((id: number) => {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Мои подборки ({selectionsData?.data.length ?? 0} из {total})
        </h1>
        <button
          onClick={() => navigate("/add-selection")}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" /> Создать подборку
        </button>
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

export default MySelectionsPage;
