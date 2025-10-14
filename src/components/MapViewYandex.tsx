import React, { useEffect, useRef, useState } from "react";
import type { PropertyResponse } from "../types";

interface MapViewProps {
  estates: PropertyResponse[];
  onEstateClick: (estate: PropertyResponse) => void;
}

declare global {
  interface Window {
    ymaps?: any;
  }
}

const apiKey = "e67fd434-4d84-4f7e-ba9e-48097b9fefb9";

const MapViewYandex: React.FC<MapViewProps> = ({ estates, onEstateClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [polygon, setPolygon] = useState<any>(null);

  const estatesWithCoords = estates.filter((e) => e.latitude && e.longitude);

  // ---------------------------
  // 🔹 Инициализация карты
  // ---------------------------
  useEffect(() => {
    const DEFAULT_ZOOM = 12;

    async function initMap() {
      try {
        if (mapInstanceRef.current) return;
        if (!window.ymaps || !mapRef.current) return;

        await window.ymaps.ready();
        const ymaps = window.ymaps;

        const validCoords = estatesWithCoords.filter(
          (e) =>
            !isNaN(Number(e.latitude)) &&
            !isNaN(Number(e.longitude)) &&
            Number(e.latitude) !== 0 &&
            Number(e.longitude) !== 0
        );

        const centerLat =
          validCoords.reduce((sum, e) => sum + Number(e.latitude), 0) /
          validCoords.length || 51.1694;
        const centerLng =
          validCoords.reduce((sum, e) => sum + Number(e.longitude), 0) /
          validCoords.length || 71.4491;

        const map = new ymaps.Map(mapRef.current, {
          center: [centerLat, centerLng],
          zoom: DEFAULT_ZOOM,
          controls: ["zoomControl", "searchControl"],
        });

        mapInstanceRef.current = map;

        // Добавляем метки
        estatesWithCoords.forEach((estate) => {
          const placemark = new ymaps.Placemark(
            [estate.latitude, estate.longitude],
            { balloonContent: `<strong>${estate.title ?? "Объект"}</strong>` },
            { preset: "islands#redIcon" }
          );
          placemark.events.add("click", () => onEstateClick(estate));
          map.geoObjects.add(placemark);
        });

        setError(null);
      } catch (err) {
        console.error("❌ Ошибка при инициализации карты:", err);
        setError(
          "Не удалось инициализировать карту. Проверьте API-ключ или соединение."
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (!window.ymaps) {
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = initMap;
      script.onerror = () => {
        setError(
          "Ошибка загрузки скрипта Яндекс.Карт. Проверьте ключ API или соединение."
        );
        setIsLoading(false);
      };
      document.head.appendChild(script);
    } else {
      setTimeout(initMap, 200);
    }

    return () => {
      if (mapRef.current) mapRef.current.innerHTML = "";
      mapInstanceRef.current = null;
    };
  }, [estatesWithCoords, onEstateClick]);

  // ---------------------------
  // ✏️ Режим рисования области
  // ---------------------------
  useEffect(() => {
    if (!mapInstanceRef.current || !window.ymaps) return;
    const map = mapInstanceRef.current;
    const ymaps = window.ymaps;

    let coords: number[][] = [];
    let drawingPolygon: any = null;

    const onMapClick = (e: any) => {
      if (!isDrawing) return;
      const point = e.get("coords");
      coords.push(point);

      if (!drawingPolygon) {
        drawingPolygon = new ymaps.Polygon(
          [coords],
          {},
          {
            strokeColor: "#FF0000",
            fillColor: "#FF000022",
            strokeWidth: 2,
          }
        );
        map.geoObjects.add(drawingPolygon);
      } else {
        drawingPolygon.geometry.setCoordinates([coords]);
      }
    };

    map.events.add("click", onMapClick);

    // завершение рисования
    const stopDrawing = () => {
      if (!drawingPolygon || coords.length < 3) {
        console.warn("⚠️ Недостаточно точек для полигона.");
        return;
      }

      console.log("✅ Завершено рисование. Координаты полигона:", coords);

      // Проверяем, какие объекты попадают внутрь
      const filtered = estatesWithCoords.filter((e) => {
        const point = new ymaps.geometry.Point([e.latitude, e.longitude]);
        return window.ymaps.geometry.contains(drawingPolygon.geometry, point);
      });

      console.log("🏠 Объекты в выделенной области:", filtered);
      setPolygon(drawingPolygon);
      setIsDrawing(false);
    };

    if (!isDrawing && polygon) {
      map.geoObjects.remove(polygon);
    }

    // двойной клик — завершить рисование
    map.events.add("dblclick", (e: any) => {
      e.preventDefault();
      if (isDrawing) stopDrawing();
    });

    return () => {
      map.events.remove("click", onMapClick);
    };
  }, [isDrawing, estatesWithCoords]);

  // ---------------------------
  // 🔹 UI: загрузка / ошибка / карта + кнопка
  // ---------------------------
  if (isLoading) {
    return (
      <div className="h-[75vh] flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
        <p className="text-gray-600">Загрузка карты...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[75vh] flex flex-col items-center justify-center bg-red-50 border border-red-300 rounded-lg text-red-700 p-4">
        <p className="font-semibold mb-2">⚠️ Ошибка</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="h-[75vh] rounded-lg overflow-hidden border border-gray-200"
      />
      <button
        onClick={() => setIsDrawing((prev) => !prev)}
        className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-md text-sm font-medium shadow-md transition ${isDrawing
            ? "bg-red-500 text-white"
            : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
          }`}
      >
        {isDrawing ? "⛔ Завершить выделение" : "✏️ Выделить область"}
      </button>
    </div>
  );
};

export default React.memo(MapViewYandex);
