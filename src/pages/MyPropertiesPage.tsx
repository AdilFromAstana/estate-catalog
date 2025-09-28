import React, { useMemo, useState } from "react";
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
import { useMyProperties } from "../hooks/useProperties";
import {
  formatPrice,
  formatRooms,
  type PropertyResponse,
} from "../api/propertyApi";

const MyPropertiesPage: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  // Защита от неавторизованного доступа
  if (!user?.id) return null;

  // Использование мокового хука вместо реального
  const { data } = useMyProperties(user.id, {
    page: 1,
    limit: 50,
  });

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>(""); // Состояние для поиска

  // Используем mockProperties напрямую
  const myProperties: PropertyResponse[] = data?.data ?? [];

  // Параметры фильтров
  const statusOptions = [
    { value: "all", label: "Все статусы" },
    { value: "active", label: "Активные" },
    { value: "hidden", label: "Скрытые" },
    { value: "sold", label: "Проданные" },
    { value: "archived", label: "В архиве" },
    { value: "draft", label: "Черновики" },
  ];

  const typeOptions = [
    { value: "all", label: "Все типы" },
    { value: "apartment", label: "Квартиры" },
    { value: "house", label: "Дома" },
    { value: "commercial", label: "Коммерч." }, // Сократил для лучшего вида в таблице
  ];

  // Логика фильтрации, поиска и сортировки
  const filteredProperties = useMemo(() => {
    let result = [...myProperties];

    // 1. Фильтрация по статусу
    if (statusFilter !== "all") {
      result = result.filter((prop) => prop.status === statusFilter);
    }

    // 2. Фильтрация по типу
    if (typeFilter !== "all") {
      result = result.filter((prop) => prop.type === typeFilter);
    }

    // 3. Поиск по названию/адресу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (prop) =>
          prop.title.toLowerCase().includes(query) ||
          (prop.houseNumber && prop.houseNumber.toLowerCase().includes(query))
      );
    }

    // 4. Сортировка по дате обновления DESC
    result.sort((a, b) => {
      const dateA = new Date(a.updatedAt || 0).getTime();
      const dateB = new Date(b.updatedAt || 0).getTime();
      return dateB - dateA;
    });

    return result;
  }, [myProperties, statusFilter, typeFilter, searchQuery]);

  // --- Вспомогательные функции рендеринга ---

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "hidden":
        return "bg-gray-200 text-gray-700 border-gray-400";
      case "sold":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "archived":
        return "bg-red-100 text-red-800 border-red-300";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Активно";
      case "hidden":
        return "Скрыто";
      case "sold":
        return "Продано";
      case "archived":
        return "В архиве";
      case "draft":
        return "Черновик";
      default:
        return status;
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-property/${id}`);
  };

  const handleDelete = (id: number) => {
    // В реальном приложении здесь будет вызов API
    // Вместо window.confirm используем alert для совместимости
    alert(
      `Вы уверены, что хотите удалить объект ID: ${id}? (имитация удаления)`
    );
  };

  const toggleVisibility = (id: number, currentStatus: string) => {
    // В реальном приложении здесь будет вызов API
    const newStatus = currentStatus === "active" ? "hidden" : "active";
    alert(`Статус объекта ID ${id} изменен на "${newStatus}" (имитация)`);
  };

  // --- Рендеринг пустого состояния (если нет объектов вообще) ---
  if (myProperties.length === 0 && !searchQuery) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 ">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-10 text-gray-800">
            Моя недвижимость
          </h1>
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center border-t-4 border-blue-500">
            <Home size={64} className="mx-auto text-blue-500 mb-6" />
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              У вас пока нет объектов
            </h2>
            <p className="text-gray-600 mb-8">
              Добавьте свой первый объект недвижимости, чтобы начать работу.
            </p>
            <button
              onClick={() => navigate("/add-property")}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
              <Plus size={20} className="inline mr-2" /> Добавить объект
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Основной рендеринг страницы (Таблица/Список) ---
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and CTA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Мои объекты ({filteredProperties.length} из {myProperties.length})
          </h1>
          <button
            onClick={() => navigate("/add-property")}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 flex items-center"
          >
            <Plus size={20} className="mr-2" /> Добавить объект
          </button>
        </div>

        {/* Фильтры и Поиск */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Поиск по адресу/названию */}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-red-500 transition"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Фильтр Статус */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter size={14} className="inline mr-1" /> Статус
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Фильтр Тип */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Home size={14} className="inline mr-1" /> Тип
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Список объектов (Таблица) */}
        <div className="bg-white shadow-xl overflow-x-auto rounded-xl border border-gray-200">
          <div className="min-w-full inline-block align-middle">
            {/* Table Header: 5 logical columns, 6 grid columns */}
            <div className="grid grid-cols-6 gap-4 py-3 px-4 font-semibold text-xs uppercase text-gray-500 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <div className="col-span-2 min-w-[350px]">
                Объект / Характеристики
              </div>
              <div className="col-span-1 min-w-[120px] text-right">Цена</div>
              <div className="col-span-1 min-w-[150px]">Статус / Обновлено</div>
              <div className="col-span-1 min-w-[80px] text-center">
                Просмотры
              </div>
              <div className="col-span-1 min-w-[160px] text-center">
                Действия
              </div>
            </div>

            {/* Table Rows Container */}
            <div className="divide-y divide-gray-100">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    // Увеличиваем вертикальный padding для большей высоты
                    className="grid grid-cols-6 gap-4 py-4 px-4 items-center group transition-colors hover:bg-blue-50"
                  >
                    {/* Column 1: Object / Photo / Address (BIGGER) */}
                    <div className="col-span-2 flex items-center space-x-4 min-w-[350px]">
                      <img
                        // Увеличен размер миниатюры
                        className="h-20 w-28 rounded-lg object-cover flex-shrink-0 border border-gray-200 shadow-sm"
                        src={
                          property.photos[0] ||
                          `https://placehold.co/120x80/93C5FD/1E3A8A?text=Фото`
                        }
                        alt={property.title}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 leading-tight line-clamp-2 hover:text-blue-600 cursor-pointer">
                          {property.title}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">
                            {property.houseNumber}
                          </span>
                        </div>
                        {/* Дополнительные характеристики в основной колонке */}
                        <div className="flex space-x-3 text-sm text-gray-700 mt-1">
                          <div className="flex items-center font-medium">
                            <Square size={14} className="mr-1 text-green-500" />
                            {property.area} м²
                          </div>
                          <div className="flex items-center">
                            <Bed size={14} className="mr-1 text-orange-500" />
                            {formatRooms(property.rooms)}
                          </div>
                          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full hidden sm:inline-flex">
                            {
                              typeOptions.find((t) => t.value === property.type)
                                ?.label
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Price */}
                    <div className="col-span-1 text-right min-w-[120px]">
                      <p className="text-xl font-extrabold text-blue-600">
                        {formatPrice(property.price)}
                      </p>
                    </div>

                    {/* Column 3: Status / Updated */}
                    <div className="col-span-1 min-w-[150px]">
                      <span
                        className={`inline-flex items-center px-3 py-1 border rounded-full text-xs font-semibold ${getStatusColor(
                          property.status
                        )}`}
                      >
                        {getStatusLabel(property.status)}
                      </span>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock size={12} className="mr-1" />
                        {new Date(property.updatedAt || 0).toLocaleDateString(
                          "ru-RU"
                        )}
                      </div>
                    </div>

                    {/* Column 4: Views */}
                    <div className="col-span-1 text-center min-w-[80px]">
                      <div className="text-lg font-bold text-gray-800 flex items-center justify-center space-x-1">
                        <Eye size={18} className="text-purple-500" />
                        <span>0</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">просмотров</p>
                    </div>

                    {/* Column 5: Actions */}
                    <div className="col-span-1 flex items-center justify-center space-x-1 min-w-[160px]">
                      <button
                        onClick={() => handleEdit(property.id)}
                        className="p-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition shadow-sm"
                        title="Редактировать"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() =>
                          toggleVisibility(property.id, property.status)
                        }
                        className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition shadow-sm"
                        title={
                          property.status === "active" ? "Скрыть" : "Показать"
                        }
                      >
                        {property.status === "active" ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="p-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition shadow-sm"
                        title="Удалить"
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

        {/* Пустой результат фильтрации, если есть объекты, но нет совпадений */}
        {filteredProperties.length === 0 && myProperties.length > 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md mt-6 border border-gray-200">
            <XCircle size={32} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              Нет объектов, соответствующих фильтрам
            </h3>
            <p className="text-gray-500 mt-2">
              Попробуйте сбросить фильтры или изменить запрос.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPropertiesPage;
