import React from "react";
import { formatPrice } from "../../../api/propertyApi";

const PropertyListItem: React.FC<{ p: any }> = ({ p }) => (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition duration-200">
    {/* Фото */}
    <div className="relative w-full md:w-1/3 max-w-[320px]">
      <img
        src={
          p.photos?.[0] ||
          "https://placehold.co/400x260/cccccc/333333?text=Нет+фото"
        }
        alt={p.title}
        className="w-full h-48 md:h-full object-cover"
      />
      <div className="absolute top-2 left-2 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
        {p.rooms}-к.
      </div>
    </div>

    {/* Контент */}
    <div className="p-5 flex flex-col md:flex-row justify-between w-full">
      {/* Информация */}
      <div className="flex flex-col flex-grow mb-4 md:mb-0 md:mr-4">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{p.title}</h3>
        <p className="text-yellow-600 font-extrabold text-2xl mb-2">
          {formatPrice(p.price)} {p.currency}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          {p.district}, {p.city}
        </p>

        <div className="text-xs text-gray-500 border-t border-gray-100 pt-2 mt-auto">
          Агент:{" "}
          {p.owner?.firstName
            ? `${p.owner.firstName} ${p.owner.lastName ?? ""}`
            : "Агентство"}{" "}
          | Обновлено: {new Date(p.createdAt).toLocaleDateString("ru-RU")}
        </div>
      </div>

      {/* CTA кнопки */}
      <div className="flex md:flex-col gap-2 w-full md:w-[180px]">
        <a
          href={`tel:${p.owner?.phone || "+77761156416"}`}
          className="flex-1 text-center bg-blue-600 text-white font-semibold rounded-lg py-2 hover:bg-blue-700 transition"
        >
          Позвонить
        </a>
        <a
          href={`https://wa.me/${p.owner?.phone || "77761156416"}`}
          target="_blank"
          className="flex-1 text-center bg-green-500 text-white font-semibold rounded-lg py-2 hover:bg-green-600 transition"
        >
          WhatsApp
        </a>
        <a
          href="#"
          className="flex-1 text-center border border-blue-600 text-blue-600 font-semibold rounded-lg py-2 hover:bg-blue-600 hover:text-white transition"
        >
          Подробнее
        </a>
      </div>
    </div>
  </div>
);

export default PropertyListItem;
