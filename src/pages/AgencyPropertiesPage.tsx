import React, { useState, useCallback } from "react";
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
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AppContext";
import {
  useAgencyProperties,
  useToggleVisibility,
} from "../hooks/useProperties";
import { useRealtors } from "../hooks/useRealtor";
import {
  formatPrice,
  formatRooms,
  type PropertyResponse,
} from "../api/propertyApi";
import {
  PROPERTY_STATUS_COLORS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_STATUS_OPTIONS,
  PropertyStatus,
} from "../contants/property-status";
import toast from "react-hot-toast";

/* -------------------------------------------------------------------------- */
/*                            Action Buttons Block                            */
/* -------------------------------------------------------------------------- */
const ActionButtons = ({
  p,
  handleEdit,
  handleDelete,
  toggleVisibility,
}: {
  p: PropertyResponse;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  toggleVisibility: (p: PropertyResponse) => void;
}) => (
  <div className="flex space-x-2 justify-end">
    <button
      onClick={() => handleEdit(p.id)}
      className="p-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition"
      title="Редактировать"
    >
      <Edit size={18} />
    </button>
    <button
      onClick={() => toggleVisibility(p)}
      className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      title={p.isPublished ? "Скрыть" : "Опубликовать"}
    >
      {p.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
    <button
      onClick={() => handleDelete(p.id)}
      className="p-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition"
      title="Удалить"
    >
      <Trash2 size={18} />
    </button>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                             Agency Properties Page                         */
/* -------------------------------------------------------------------------- */
const AgencyPropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{
    status?: PropertyStatus;
    ownerId?: number;
  }>({});

  const itemsPerPage = 8;

  // === Получаем объекты агентства ===
  const { data, isLoading } = useAgencyProperties(user?.agencyId!, {
    page: currentPage,
    limit: itemsPerPage,
    status: filters.status,
    ownerId: filters.ownerId,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const properties =
    (data?.data ?? []).filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const { data: realtorsData } = useRealtors(user?.agencyId!, 1, 100, {
    status: "active",
  });
  const owners = realtorsData?.data ?? [];

  const { mutate: toggleVisibilityMutation } = useToggleVisibility();

  const handleDelete = useCallback((id: number) => {
    toast.success(`Объект ID ${id} помечен на удаление (демо-режим)`);
  }, []);

  const handleEdit = useCallback(
    (id: number) => navigate(`/edit-property/${id}`),
    [navigate]
  );

  const toggleVisibility = useCallback(
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

  const renderDesktopRow = (p: PropertyResponse) => (
    <div
      key={`${p.id}-renderDesktopRow`}
      className="hidden lg:grid grid-cols-[minmax(220px,2fr)_minmax(120px,1fr)_minmax(130px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)] gap-3 py-4 px-5 items-center hover:bg-blue-50 transition"
    >
      {/* Колонка: Объект */}
      <div className="flex items-center space-x-4 overflow-hidden">
        <img
          src={p.photos?.[0] || "https://placehold.co/120x80?text=Фото"}
          alt={p.title}
          className="h-20 w-28 rounded-lg object-cover border border-gray-200 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p
            onClick={() => handleEdit(p.id)}
            title={p.title}
            className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer truncate"
          >
            {p.title}
          </p>
          <div className="flex items-center text-xs text-gray-500 mt-1 truncate">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            {p.district || "—"}, {p.city || "—"}
          </div>
          <div className="flex text-sm text-gray-700 mt-1 space-x-3">
            <span className="flex items-center">
              <Square size={14} className="mr-1 text-green-500" />
              {p.area} м²
            </span>
            <span className="flex items-center">
              <Bed size={14} className="mr-1 text-orange-500" />
              {formatRooms(p.rooms)}
            </span>
          </div>
        </div>
      </div>

      {/* Цена */}
      <div className="text-right font-bold text-blue-600 text-lg whitespace-nowrap">
        {formatPrice(p.price)}
      </div>

      {/* Статус */}
      <div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-${
            PROPERTY_STATUS_COLORS[p.status]
          }-100 text-${PROPERTY_STATUS_COLORS[p.status]}-800 whitespace-nowrap`}
        >
          {PROPERTY_STATUS_LABELS[p.status]}
        </span>
        <div className="text-xs text-gray-500 flex items-center mt-1 whitespace-nowrap">
          <Clock size={12} className="mr-1" />
          {new Date(p.updatedAt).toLocaleDateString("ru-RU")}
        </div>
      </div>

      {/* Риэлтор */}
      <div className="flex items-center text-sm text-gray-800 whitespace-nowrap">
        <User size={16} className="mr-2 text-blue-500 flex-shrink-0" />
        <span className="truncate">
          {p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : "—"}
        </span>
      </div>

      {/* Действия */}
      <ActionButtons
        p={p}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        toggleVisibility={toggleVisibility}
      />
    </div>
  );

  const renderMobileCard = (p: PropertyResponse) => (
    <div
      key={`${p.id}-renderMobileCard`}
      className="lg:hidden p-4 border-b border-gray-100 bg-white hover:bg-blue-50 transition"
    >
      <div className="flex space-x-4">
        <img
          src={p.photos?.[0] || "https://placehold.co/100x70?text=Фото"}
          alt={p.title}
          className="h-16 w-24 rounded-lg object-cover border border-gray-200"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p
              onClick={() => handleEdit(p.id)}
              title={p.title}
              className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer truncate"
            >
              {p.title}
            </p>
            <span
              className={`inline-flex ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-${
                PROPERTY_STATUS_COLORS[p.status]
              }-100 text-${PROPERTY_STATUS_COLORS[p.status]}-800`}
            >
              {PROPERTY_STATUS_LABELS[p.status]}
            </span>
          </div>

          <p className="text-blue-600 font-bold mt-1 text-lg">
            {formatPrice(p.price)}
          </p>

          <div className="flex flex-wrap items-center text-xs text-gray-500 mt-1 space-x-2">
            <span className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {p.district || "—"}
            </span>
            <span className="flex items-center">
              <Square size={12} className="mr-1 text-green-500" />
              {p.area} м²
            </span>
            <span className="flex items-center">
              <Bed size={12} className="mr-1 text-orange-500" />
              {formatRooms(p.rooms)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
        <div className="flex items-center text-gray-700">
          <User size={14} className="mr-2 text-blue-500" />
          <span className="font-medium">
            {p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : "—"}
          </span>
        </div>
        <ActionButtons
          p={p}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          toggleVisibility={toggleVisibility}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 pb-12 w-full overflow-x-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-10 pt-8 max-w-none">
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Объекты агентства ({properties.length} из {total})
          </h1>
          <button
            onClick={() => navigate("/add-property")}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" /> Добавить объект
          </button>
        </div>

        {/* Фильтры */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Поиск по названию или адресу
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Введите ЖК, улицу или название..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500"
                  >
                    <XCircle size={18} />
                  </button>
                )}
              </div>
            </div>

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
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">Все</option>
                {PROPERTY_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
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
        </div>

        {/* Таблица / карточки */}
        <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden w-full">
          {/* Заголовок таблицы */}
          <div className="hidden lg:grid grid-cols-[minmax(220px,2fr)_minmax(120px,1fr)_minmax(130px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)] gap-3 py-3 px-5 font-semibold text-xs uppercase text-gray-500 border-b bg-gray-50">
            <div>Объект</div>
            <div className="text-right">Цена</div>
            <div>Статус</div>
            <div>Риэлтор</div>
            <div className="text-right">Действия</div>
          </div>

          {/* Список объектов */}
          <div className="divide-y divide-gray-100">
            {properties.length > 0 ? (
              properties.map((p) => (
                <React.Fragment key={p.id}>
                  {renderMobileCard(p)}
                  {renderDesktopRow(p)}
                </React.Fragment>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                Нет объектов, соответствующих фильтрам.
              </div>
            )}
          </div>
        </div>

        {/* Пагинация */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
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
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Назад
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Вперёд
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyPropertiesPage;
