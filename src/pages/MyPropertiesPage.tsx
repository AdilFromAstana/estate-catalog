import React, { useState } from "react";
import { useApp } from "../AppContext";
import {
  Edit,
  Trash2,
  MapPin,
  Bed,
  Square,
  Filter,
  Eye,
  EyeOff,
  Plus,
  Search,
  XCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMyProperties, useToggleVisibility } from "../hooks/useProperties";
import {
  formatPrice,
  formatRooms,
  type PropertyResponse,
} from "../api/propertyApi";
import toast from "react-hot-toast";
import {
  PROPERTY_STATUS_COLORS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_STATUS_OPTIONS,
  PropertyStatus,
} from "../contants/property-status";

const MyPropertiesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { user } = useApp();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<{
    search: string;
    status: PropertyStatus | undefined;
  }>({
    search: "",
    status: undefined,
  });

  if (!user?.id) return null;

  const { data } = useMyProperties(user.id, {
    page: currentPage,
    limit: itemsPerPage,
    search: filters.search,
    status: filters.status,
  });

  const properties: PropertyResponse[] = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const { mutate: toggleVisibilityMutation } = useToggleVisibility();

  const toggleVisibility = (property: PropertyResponse) => {
    const newStatus = !property.isPublished;
    toggleVisibilityMutation(
      { id: property.id, isPublished: newStatus },
      {
        onSuccess: () => {
          toast.success(
            `Объект ID ${property.id} теперь ${
              newStatus ? "опубликован" : "скрыт"
            }`
          );
        },
        onError: () => toast.error("Ошибка при изменении публикации"),
      }
    );
  };

  const handleEdit = (id: number) => navigate(`/edit-property/${id}`);

  const handleDelete = (id: number) => {
    alert(`Удаление объекта ID: ${id} (пока имитация)`);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок + кнопка */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Мои объекты ({properties.length} из {total})
          </h1>
          <button
            onClick={() => navigate("/add-property")}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 flex items-center"
          >
            <Plus size={20} className="mr-2" /> Добавить объект
          </button>
        </div>

        {/* Фильтры */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Поиск
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Введите название или адрес..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500"
                  >
                    <XCircle size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Фильтр по статусу */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter size={14} className="inline mr-1" /> Статус
              </label>
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: (e.target.value as PropertyStatus) || undefined,
                  }))
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">— Все —</option>
                {PROPERTY_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Таблица объектов */}
        <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-6 gap-4 py-3 px-4 font-semibold text-xs uppercase text-gray-500 border-b bg-gray-50">
            <div className="col-span-2">Объект</div>
            <div className="col-span-1 text-right">Цена</div>
            <div className="col-span-1">Статус</div>
            <div className="col-span-2 text-center">Действия</div>
          </div>

          <div className="divide-y divide-gray-100">
            {properties.length > 0 ? (
              properties.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-6 gap-4 py-4 px-4 items-center hover:bg-blue-50 transition"
                >
                  {/* Объект */}
                  <div className="col-span-2 flex items-center space-x-4">
                    <img
                      src={
                        p.photos[0] || "https://placehold.co/120x80?text=Фото"
                      }
                      alt={p.title}
                      className="h-20 w-28 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <p
                        onClick={() => handleEdit(p.id)}
                        className="font-semibold text-gray-900 leading-tight hover:text-blue-600 cursor-pointer"
                      >
                        {p.title}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {p.district}, {p.city}
                      </div>
                      <div className="flex text-sm text-gray-700 mt-1">
                        <Square size={14} className="mr-1 text-green-500" />
                        {p.area} м²
                        <Bed size={14} className="ml-2 mr-1 text-orange-500" />
                        {formatRooms(p.rooms)}
                      </div>
                    </div>
                  </div>

                  {/* Цена */}
                  <div className="col-span-1 text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {formatPrice(p.price)}
                    </p>
                  </div>

                  {/* Статус */}
                  <div className="col-span-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-${
                        PROPERTY_STATUS_COLORS[p.status]
                      }-100 text-${PROPERTY_STATUS_COLORS[p.status]}-800`}
                    >
                      {PROPERTY_STATUS_LABELS[p.status]}
                    </span>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock size={12} className="mr-1" />
                      {new Date(p.updatedAt || 0).toLocaleDateString("ru-RU")}
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="col-span-2 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(p.id)}
                      className="p-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => toggleVisibility(p)}
                      className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      {p.isPublished ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                Нет объектов для отображения.
              </div>
            )}
          </div>
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Показано{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              -{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, total)}
              </span>{" "}
              из <span className="font-medium">{total}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Назад
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Вперёд
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPropertiesPage;
