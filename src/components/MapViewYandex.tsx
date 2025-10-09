import React, { useEffect, useRef } from "react";
import type { PropertyResponse } from "../api/propertyApi";

interface MapViewProps {
  estates: PropertyResponse[];
  onEstateClick: (estate: PropertyResponse) => void;
}

declare global {
  interface Window {
    ymaps?: any;
  }
}

const MapViewYandex: React.FC<MapViewProps> = ({ estates, onEstateClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const estatesWithCoords = estates.filter(
    (e) => e.coordinates && e.coordinates.lat && e.coordinates.lng
  );

  useEffect(() => {
    if (estatesWithCoords.length === 0) return;

    // Загружаем Яндекс.Карты, если их ещё нет
    const api = "e67fd434-4d84-4f7e-ba9e-48097b9fefb9";
    if (!window?.ymaps) {
      const script = document.createElement("script");
      // TODO: вставь свой API-ключ вместо `YOUR_API_KEY`
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${api}&lang=ru_RU`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      window.ymaps.ready(() => {
        const ymaps = window.ymaps;

        // Центр карты (среднее по координатам)
        const centerLat =
          estatesWithCoords.reduce(
            (sum, e) => sum + (e.coordinates?.lat ?? 0),
            0
          ) / estatesWithCoords.length;
        const centerLng =
          estatesWithCoords.reduce(
            (sum, e) => sum + (e.coordinates?.lng ?? 0),
            0
          ) / estatesWithCoords.length;

        // Создаём карту
        const map = new ymaps.Map(mapRef.current, {
          center: [centerLat, centerLng],
          zoom: 12,
          controls: ["zoomControl", "searchControl"],
        });

        // Добавляем метки
        estatesWithCoords.forEach((estate) => {
          const placemark = new ymaps.Placemark(
            [estate.coordinates!.lat, estate.coordinates!.lng],
            {
              balloonContent: `<strong>${estate.title ?? "Объект"}</strong>`,
            },
            {
              preset: "islands#redIcon",
            }
          );

          placemark.events.add("click", () => onEstateClick(estate));
          map.geoObjects.add(placemark);
        });
      });
    }

    // Очистка карты при размонтировании
    return () => {
      if (mapRef.current) mapRef.current.innerHTML = "";
    };
  }, [estatesWithCoords, onEstateClick]);

  //   if (estatesWithCoords.length === 0) {
  //     return (
  //       <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
  //         <p className="text-gray-500">Нет объектов для отображения на карте</p>
  //       </div>
  //     );
  //   }

  return (
    <div
      ref={mapRef}
      className="h-[75vh] rounded-lg overflow-hidden border border-gray-200"
    />
  );
};

export default MapViewYandex;
