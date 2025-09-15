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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyPropertiesPage: React.FC = () => {
  const { properties, user, deleteProperty, updateProperty } = useApp();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Фильтруем свойства текущего пользователя
  const myProperties = properties.filter((prop) => prop.agent.id === user?.id);

  // Применяем фильтры
  const filteredProperties = myProperties.filter((prop) => {
    const statusMatch = statusFilter === "all" || prop.status === statusFilter;
    const typeMatch = typeFilter === "all" || typeFilter;
    return statusMatch && typeMatch;
  });

  const statusOptions = [
    { value: "all", label: "Все статусы" },
    { value: "active", label: "Активные" },
    { value: "sold", label: "Проданные" },
    { value: "archived", label: "В архиве" },
    { value: "draft", label: "Черновики" },
  ];

  const typeOptions = [
    { value: "all", label: "Все типы" },
    { value: "apartment", label: "Квартиры" },
    { value: "house", label: "Дома" },
    { value: "commercial", label: "Коммерческие" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-blue-100 text-blue-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Активно";
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

  const handleEdit = (id: string) => {
    navigate(`/edit-property/${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот объект?")) {
      deleteProperty(id);
    }
  };

  const toggleVisibility = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "hidden" : "active";
    updateProperty(id, { status: newStatus });
  };

  const formatRooms = (bedrooms: number): string => {
    if (bedrooms === 0) return "Студия";
    if (bedrooms === 1) return "1-комнатная";
    if (bedrooms >= 2 && bedrooms <= 4) return `${bedrooms}-х комнатная`;
    return `${bedrooms}-комнатная`;
  };

  if (myProperties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">Моя недвижимость</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Home size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              У вас пока нет объектов
            </h2>
            <p className="text-gray-600 mb-6">
              Добавьте свой первый объект недвижимости
            </p>
            <button
              onClick={() => navigate("/add-property")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Добавить объект
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Моя недвижимость</h1>
          <button
            onClick={() => navigate("/add-property")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Добавить объект
          </button>
        </div>

        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="font-semibold">Фильтры</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип недвижимости
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative">
                <img
                  src={
                    property.images[0] ||
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop"
                  }
                  alt={property.houseNumber}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      property.status
                    )}`}
                  >
                    {getStatusLabel(property.status)}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                  {formatRooms(property.roomCount)}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {property.price.toLocaleString("ru-RU")} ₸
                </p>

                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm line-clamp-1">
                    {property.coordinates.lat}
                  </span>
                  <span className="text-sm line-clamp-1">
                    {property.coordinates.lng}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Bed size={16} className="mr-1" />
                    <span>{formatRooms(property.roomCount)}</span>
                  </div>
                  <div className="flex items-center">
                    <Square size={16} className="mr-1" />
                    <span>{property.livingArea} м²</span>
                  </div>
                </div>

                <div className="flex justify-between space-x-2">
                  <button
                    onClick={() => handleEdit(property.id)}
                    className="flex-1 flex items-center justify-center text-blue-600 hover:text-blue-800 p-2"
                  >
                    <Edit size={16} className="mr-1" />
                    Редакт.
                  </button>
                  <button
                    onClick={() =>
                      toggleVisibility(property.id, property.status)
                    }
                    className="flex-1 flex items-center justify-center text-gray-600 hover:text-gray-800 p-2"
                  >
                    {property.status === "active" ? (
                      <EyeOff size={16} className="mr-1" />
                    ) : (
                      <Eye size={16} className="mr-1" />
                    )}
                    {property.status === "active" ? "Скрыть" : "Показать"}
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="flex-1 flex items-center justify-center text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Нет объектов, соответствующих выбранным фильтрам
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPropertiesPage;
