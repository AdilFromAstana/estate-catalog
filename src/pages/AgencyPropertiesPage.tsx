import React, { useState } from "react";
import { useApp } from "../AppContext";
import {
  Edit,
  Trash2,
  Home,
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
import { useAgencyProperties } from "../hooks/useProperties";
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

const typeOptions = [
  { value: "all", label: "Все типы" },
  { value: "apartment", label: "Квартиры" },
  { value: "house", label: "Дома" },
  { value: "commercial", label: "Коммерч." },
];

const AgencyPropertiesPage: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  // === Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // === Фильтры
  const [filters, setFilters] = useState({
    search: "",
    status: PropertyStatus.ACTIVE,
    type: "all",
    ownerId: undefined as number | undefined,
    sortBy: "updatedAt",
    sortDirection: "DESC" as "ASC" | "DESC",
  });

  // === Получение объектов агентства

  const { data, isLoading } = useAgencyProperties(user?.agencyId!, {
    page: currentPage,
    limit: itemsPerPage,
    search: filters.search,
    status: filters.status,
    type: filters.type !== "all" ? (filters.type as any) : undefined,
    ownerId: filters.ownerId,
    // sortBy: filters.sortBy,
    // sortDirection: filters.sortDirection,
  });

  const properties: PropertyResponse[] = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  // === Подтягиваем сотрудников агентства для фильтра ownerId
  const { data: realtorsData } = useRealtors(user?.agencyId!, 1, 100, {
    status: "active",
  });

  const owners = realtorsData?.data ?? [];

  const handleEdit = (id: number) => {
    navigate(`/edit-property/${id}`);
  };

  const handleDelete = (id: number) => {
    alert(`Удаление объекта ID: ${id} (имитация)`);
  };

  const toggleVisibility = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "hidden" : "active";
    alert(`Статус объекта ID ${id} изменен на "${newStatus}" (имитация)`);
  };

  // === Лоадер
  if (isLoading) {
    return <div className="p-6">Загрузка...</div>;
  }

  // === Empty state (нет объектов вообще)
  // if (properties.length === 0 && !filters.search) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 py-12 px-4">
  //       <div className="max-w-4xl mx-auto">
  //         <h1 className="text-3xl font-bold mb-10 text-gray-800">
  //           Объекты агентства
  //         </h1>
  //         <div className="bg-white rounded-2xl shadow-xl p-10 text-center border-t-4 border-blue-500">
  //           <Home size={64} className="mx-auto text-blue-500 mb-6" />
  //           <h2 className="text-2xl font-semibold mb-3 text-gray-800">
  //             У агентства пока нет объектов
  //           </h2>
  //           <p className="text-gray-600 mb-8">
  //             Добавьте первый объект недвижимости, чтобы начать работу.
  //           </p>
  //           <button
  //             onClick={() => navigate("/add-property")}
  //             className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
  //           >
  //             <Plus size={20} className="inline mr-2" /> Добавить объект
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-9xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Объекты агентства ({properties.length} из {total})
          </h1>
          <button
            onClick={() => navigate("/add-property")}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 flex items-center"
          >
            <Plus size={20} className="mr-2" /> Добавить объект
          </button>
        </div>

        {/* Фильтры */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Поиск */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Поиск по названию или адресу
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Введите ЖК, улицу или название..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {filters.search && (
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, search: "" }))
                    }
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-red-500 transition"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Фильтр статус */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter size={14} className="inline mr-1" /> Статус
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value as PropertyStatus,
                  }))
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition"
              >
                {PROPERTY_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Фильтр тип */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Home size={14} className="inline mr-1" /> Тип
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition"
              >
                {typeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Фильтр сотрудник */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Владелец (сотрудник)
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition"
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

        {/* Таблица объектов */}
        <div className="bg-white shadow-xl overflow-x-auto rounded-xl border border-gray-200">
          <div className="min-w-full inline-block align-middle">
            {/* Header */}
            <div className="grid grid-cols-6 gap-4 py-3 px-4 font-semibold text-xs uppercase text-gray-500 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <div className="col-span-2 min-w-[350px]">
                Объект / Характеристики
              </div>
              <div className="col-span-1 text-right">Цена</div>
              <div className="col-span-1">Статус / Обновлено</div>
              <div className="col-span-1 text-center">Просмотры</div>
              <div className="col-span-1 text-center">Действия</div>
            </div>

            <div className="divide-y divide-gray-100">
              {properties.length > 0 ? (
                properties.map((p) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-6 gap-4 py-4 px-4 items-center hover:bg-blue-50 transition"
                  >
                    {/* Title */}
                    <div className="col-span-2 flex items-center space-x-4">
                      <img
                        className="h-20 w-28 rounded-lg object-cover border border-gray-200"
                        src={
                          p.photos[0] ||
                          `https://placehold.co/120x80/93C5FD/1E3A8A?text=Фото`
                        }
                        alt={p.title}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 leading-tight line-clamp-2 hover:text-blue-600 cursor-pointer">
                          {p.title}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {p.houseNumber}
                        </div>
                        <div className="flex space-x-3 text-sm text-gray-700 mt-1">
                          <Square size={14} className="mr-1 text-green-500" />
                          {p.area} м²
                          <Bed
                            size={14}
                            className="ml-2 mr-1 text-orange-500"
                          />
                          {formatRooms(p.rooms)}
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-1 text-right">
                      <p className="text-xl font-extrabold text-blue-600">
                        {formatPrice(p.price)}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 border rounded-full text-xs font-semibold bg-${
                          PROPERTY_STATUS_COLORS[p.status]
                        }-400`}
                      >
                        {PROPERTY_STATUS_LABELS[p.status]}
                      </span>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock size={12} className="mr-1" />
                        {new Date(p.updatedAt || 0).toLocaleDateString("ru-RU")}
                      </div>
                    </div>

                    {/* Views */}
                    <div className="col-span-1 text-center">
                      <div className="text-lg font-bold text-gray-800 flex items-center justify-center space-x-1">
                        <Eye size={18} className="text-purple-500" />
                        <span>0</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">просмотров</p>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(p.id)}
                        className="p-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => toggleVisibility(p.id, p.status)}
                        className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        {p.status === "active" ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
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
                <div className="px-4 py-8 text-center">
                  <XCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-base font-medium text-gray-900">
                    Объекты не найдены
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Нет объектов, соответствующих выбранным фильтрам.
                  </p>
                </div>
              )}
            </div>
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
              из <span className="font-medium">{total}</span> объектов
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

export default AgencyPropertiesPage;
