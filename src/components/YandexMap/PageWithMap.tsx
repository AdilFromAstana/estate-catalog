import React, { useState } from "react";
import MapViewYandex from "../components/Map/MapViewYandex";
import type { PropertyResponse } from "../api/propertyApi";

const PageWithMap = () => {
  const [estates, setEstates] = useState<PropertyResponse[]>([
    {
      id: 1,
      title: "Квартира в Астане",
      latitude: 51.1741,
      longitude: 71.4123,
    },
    {
      id: 2,
      title: "Дом на левом берегу",
      latitude: 51.1578,
      longitude: 71.4322,
    },
    {
      id: 3,
      title: "Коттедж у реки",
      latitude: 51.1815,
      longitude: 71.4468,
    },
  ]);

  const handleEstateClick = (estate: PropertyResponse) => {
    alert(`Вы выбрали: ${estate.title}`);
  };

  return (
    <div className="flex gap-4">
      {/* 🗺️ Карта */}
      <div className="w-2/3 relative">
        <MapViewYandex estates={estates} onEstateClick={handleEstateClick} />
      </div>

      {/* 📋 Список домов сбоку */}
      <div className="w-1/3 h-[75vh] overflow-y-auto border rounded-md p-3">
        <h2 className="font-semibold mb-2">Все объекты ({estates.length})</h2>
        {estates.map((e) => (
          <div
            key={e.id}
            className="border-b py-2 hover:bg-gray-50 cursor-pointer"
            onClick={() => handleEstateClick(e)}
          >
            <strong>{e.title}</strong>
            <p className="text-sm text-gray-500">
              {e.latitude}, {e.longitude}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageWithMap;
