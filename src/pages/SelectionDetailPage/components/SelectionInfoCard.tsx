import React from "react";
import {
  Home,
  Bed,
  Building2,
  Wallet,
  Phone,
  MessageCircle,
} from "lucide-react";
import SafeImage from "../../../components/SafeImage";
import type { SelectionInfoCardProps } from "../../../types";

const SelectionInfoCard: React.FC<SelectionInfoCardProps> = ({
  selection,
  total,
  createdBy,
}) => {
  const filters = selection?.filters || {};

  // 👇 Формируем читаемые теги из объекта filters
  const readableFilters: { icon: React.ReactNode; label: string }[] = [];

  if (filters.cityId)
    readableFilters.push({
      icon: <Building2 size={16} className="text-blue-600" />,
      label: "Город: Астана", // можно маппить ID → название
    });

  if (filters.rooms)
    readableFilters.push({
      icon: <Bed size={16} className="text-orange-500" />,
      label: `Комнат: ${filters.rooms}`,
    });

  if (filters.maxPrice)
    readableFilters.push({
      icon: <Wallet size={16} className="text-green-600" />,
      label: `До ${Number(filters.maxPrice).toLocaleString("ru-RU")} ₸`,
    });

  if (total)
    readableFilters.push({
      icon: <Home size={16} className="text-purple-600" />,
      label: `Объектов: ${total}`,
    });

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
      {/* === Левая часть: информация о подборке === */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          Подборка: {selection.name || "Без названия"}
        </h2>

        {selection.description ? (
          <p className="text-gray-600 mb-4">{selection.description}</p>
        ) : (
          <p className="text-gray-500 mb-4">
            Подборка квартир, соответствующих вашим параметрам.
          </p>
        )}

        {readableFilters.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-2">
            {readableFilters.map((f, i) => (
              <span
                key={i}
                className="flex items-center gap-2 px-4 py-1.5 bg-white text-gray-700 font-medium text-sm border border-gray-200 rounded-full shadow-sm"
              >
                {f.icon}
                {f.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* === Правая часть: карточка автора подборки === */}
      <div className="flex flex-col items-center md:items-end text-center md:text-right border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
        {/* Фото или инициалы */}
        <SafeImage srcPath={createdBy.avatar} />

        {/* Имя и фамилия */}
        <h3 className="text-base font-semibold text-gray-900">
          {createdBy.firstName} {createdBy.lastName}
        </h3>
        <p className="text-sm text-gray-500 mb-3">Создатель подборки</p>

        {/* Контакты */}
        {createdBy.phone && (
          <div className="flex gap-2">
            <a
              href={`tel:${createdBy.phone}`}
              className="flex items-center gap-1 bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
            >
              <Phone size={14} /> Позвонить
            </a>
            <a
              href={`https://wa.me/${createdBy.phone.replace(/\D/g, "")}`}
              target="_blank"
              className="flex items-center gap-1 bg-green-500 text-white text-sm px-3 py-1.5 rounded-md hover:bg-green-600 transition"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionInfoCard;
