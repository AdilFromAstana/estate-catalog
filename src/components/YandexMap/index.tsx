import React, { useEffect, useState } from "react";
import type { PropertyResponse } from "../../api/propertyApi";

interface DrawMapProps {
  estates: PropertyResponse[];
}

const DrawMap: React.FC<DrawMapProps> = ({ estates }) => {
  const [ymaps, setYmaps] = useState<any>(null);
  const [map, setMap] = useState<any>(null);
  const [filtered, setFiltered] = useState<PropertyResponse[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [polygon, setPolygon] = useState<any>(null);

  useEffect(() => {
    const apiKey = "e67fd434-4d84-4f7e-ba9e-48097b9fefb9";

    const loadYMaps = async () => {
      if (window.ymaps) {
        await window.ymaps.ready();
        setYmaps(window.ymaps);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU&load=geoObject.addon.editor,geometryEditor`;
      script.async = true;
      script.onload = async () => {
        await window.ymaps.ready();
        setYmaps(window.ymaps);
      };
      document.head.appendChild(script);
    };

    loadYMaps();
  }, []);

  // Создаём карту
  useEffect(() => {
    if (!ymaps) return;

    const mapInstance = new ymaps.Map("map", {
      center: [51.1694, 71.4491],
      zoom: 12,
      controls: ["zoomControl"],
    });
    setMap(mapInstance);

    // Добавляем все дома как метки
    estates.forEach((e) => {
      if (!e.latitude || !e.longitude) return;
      const placemark = new ymaps.Placemark(
        [Number(e.latitude), Number(e.longitude)],
        { balloonContent: e.title ?? "Объект" },
        { preset: "islands#redIcon" }
      );
      mapInstance.geoObjects.add(placemark);
    });

    return () => mapInstance.destroy();
  }, [ymaps]);

  // 🔹 Начало рисования
  const startDrawing = () => {
    if (!ymaps || !map) return;
    if (polygon) {
      map.geoObjects.remove(polygon);
      setPolygon(null);
    }

    const newPolygon = new ymaps.Polygon(
      [],
      {},
      {
        editorDrawingCursor: "crosshair",
        fillColor: "#00FF0033",
        strokeColor: "#00AA00",
        strokeWidth: 2,
      }
    );

    map.geoObjects.add(newPolygon);
    newPolygon.editor.startDrawing();
    setPolygon(newPolygon);
    setIsDrawing(true);
  };

  // 🔹 Завершение рисования
  const stopDrawing = () => {
    if (!polygon) return;
    polygon.editor.stopDrawing();
    setIsDrawing(false);

    // Получаем координаты контура
    const coords = polygon.geometry.getCoordinates()[0];
    console.log("📍 Полигон координаты:", coords);

    // Фильтруем дома по попаданию в полигон
    const inside = estates.filter((e) => {
      const lat = Number(e.latitude);
      const lng = Number(e.longitude);
      return polygon.geometry.contains([lat, lng]);
    });

    console.log("🏠 Найдено домов:", inside.length);
    setFiltered(inside);
  };

  return (
    <div className="flex gap-4">
      <div className="w-2/3 relative">
        <div
          id="map"
          className="h-[75vh] rounded-lg overflow-hidden border border-gray-200"
        />
        <button
          onClick={() => (isDrawing ? stopDrawing() : startDrawing())}
          className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-md text-sm font-medium shadow-md transition ${
            isDrawing
              ? "bg-red-500 text-white"
              : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
          }`}
        >
          {isDrawing ? "⛔ Завершить выделение" : "✏️ Обвести область"}
        </button>
      </div>

      <div className="w-1/3 border rounded-md p-3 overflow-y-auto">
        <h2 className="font-semibold mb-2">
          Дома в области: {filtered.length}
        </h2>
        {filtered.length === 0 ? (
          <p className="text-gray-500">Выделите область ✏️</p>
        ) : (
          filtered.map((e) => (
            <div key={e.id} className="py-2 border-b">
              <strong>{e.title}</strong>
              <p className="text-sm text-gray-500">
                {e.latitude}, {e.longitude}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DrawMap;
