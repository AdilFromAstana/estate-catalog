import React from "react";
import { MapPin, Bed, Square, Clock, User } from "lucide-react";
import { formatPrice } from "../../../api/propertyApi";

const PropertyCard: React.FC<{ p: any }> = ({ p }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 flex flex-col">
    {/* Фото */}
    <div className="relative h-48">
      <img
        src={
          p.photos?.[0] ||
          "https://placehold.co/600x400/cccccc/333333?text=Нет+фото"
        }
        alt={p.title}
        className="w-full h-full object-cover"
        onError={(e) =>
          (e.currentTarget.src =
            "https://placehold.co/600x400/cccccc/333333?text=Нет+фото")
        }
      />
      <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold p-2 rounded-bl-lg shadow">
        {p.rooms}-к. | {p.area} м²
      </div>
    </div>

    {/* Контент */}
    <div className="flex flex-col p-5 flex-grow">
      <h3
        className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
        title={p.title}
      >
        {p.title}
      </h3>

      <p className="text-yellow-600 font-extrabold text-2xl mb-3">
        {formatPrice(p.price)} {p.currency}
      </p>

      <div className="flex flex-col gap-2 mb-4 text-sm text-gray-700">
        <span className="flex items-center">
          <MapPin size={16} className="mr-2 text-red-500 flex-shrink-0" />
          {p.district}, {p.city}
        </span>
        <span className="flex items-center">
          <Square size={16} className="mr-2 text-green-600 flex-shrink-0" />
          {p.area} м²
        </span>
        <span className="flex items-center">
          <Bed size={16} className="mr-2 text-orange-500 flex-shrink-0" />
          Комнат: {p.rooms}
        </span>
      </div>

      {/* Нижняя часть карточки */}
      <div className="mt-auto border-t border-gray-100 pt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <User size={14} className="mr-1 text-purple-600" />
            {p.owner?.firstName
              ? `${p.owner.firstName} ${p.owner.lastName ?? ""}`
              : "Агентство"}
          </div>
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            {new Date(p.createdAt).toLocaleDateString("ru-RU")}
          </div>
        </div>

        {/* CTA кнопки */}
        <div className="flex flex-col gap-3">
          {/* Основная кнопка — большая, во всю ширину */}
          <a
            href="#"
            className="w-full text-center bg-blue-600 text-white font-semibold rounded-lg py-3 text-sm hover:bg-blue-700 transition shadow-md hover:shadow-lg"
          >
            Подробнее
          </a>

          {/* Второстепенные кнопки — поменьше и рядом */}
          <div className="flex gap-2 justify-between">
            <a
              href={`tel:${p.owner?.phone || "+77761156416"}`}
              className="flex-1 text-center text-sm bg-blue-50 text-blue-700 font-semibold rounded-md py-2 border border-blue-300 hover:bg-blue-100 transition"
            >
              Позвонить
            </a>

            <a
              href={`https://wa.me/${p.owner?.phone || "77761156416"}`}
              target="_blank"
              className="flex-1 text-center text-sm bg-green-500 text-white font-semibold rounded-md py-2 hover:bg-green-600 transition"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PropertyCard;
