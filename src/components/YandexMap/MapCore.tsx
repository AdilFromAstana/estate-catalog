import React, { useEffect, useRef } from "react";
import type { PropertyResponse } from "../../api/propertyApi";

interface MapCoreProps {
  estates: PropertyResponse[];
  onEstateClick: (estate: PropertyResponse) => void;
  onMapReady: (map: any, ymaps: any) => void;
}

export const MapCore: React.FC<MapCoreProps> = ({
  estates,
  onEstateClick,
  onMapReady,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const loadYandexMaps = (apiKey: string): Promise<typeof ymaps> => {
    return new Promise((resolve, reject) => {
      if (window.ymaps) {
        window.ymaps.ready(() => resolve(window.ymaps));
        return;
      }

      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = () => window.ymaps.ready(() => resolve(window.ymaps));
      script.onerror = () => reject("Ошибка загрузки API Яндекс.Карт");
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    const apiKey = "e67fd434-4d84-4f7e-ba9e-48097b9fefb9";
    const DEFAULT_CENTER = [51.1694, 71.4491];
    const DEFAULT_ZOOM = 12;

    const init = async () => {
      try {
        const ymaps = await loadYandexMaps(apiKey);
        if (!mapRef.current) return;

        const map = new ymaps.Map(mapRef.current, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          controls: ["zoomControl", "searchControl"],
        });

        // Добавляем метки
        estates
          .filter(
            (e) =>
              e.latitude &&
              e.longitude &&
              !isNaN(Number(e.latitude)) &&
              !isNaN(Number(e.longitude))
          )
          .forEach((estate) => {
            const placemark = new ymaps.Placemark(
              [Number(estate.latitude), Number(estate.longitude)],
              {
                balloonContent: `<strong>${estate.title ?? "Объект"}</strong>`,
              },
              { preset: "islands#redIcon" }
            );
            placemark.events.add("click", () => onEstateClick(estate));
            map.geoObjects.add(placemark);
          });

        onMapReady(map, ymaps);
        mapInstanceRef.current = map;
      } catch (err) {
        console.error("Ошибка инициализации карты:", err);
      }
    };

    init();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
    };
  }, [estates, onEstateClick, onMapReady]);

  return (
    <div
      ref={mapRef}
      className="h-[75vh] rounded-lg overflow-hidden border border-gray-200"
    />
  );
};
