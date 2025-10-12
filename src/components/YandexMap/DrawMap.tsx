import React, { useEffect, useState } from "react";
import type { PropertyResponse } from "../../api/propertyApi";

interface DrawMapProps {
  estates: PropertyResponse[];
}

const DrawMap: React.FC<DrawMapProps> = ({ estates }) => {
  const [ymaps, setYmaps] = useState<any>(null);
  const [map, setMap] = useState<any>(null);
  const [polygon, setPolygon] = useState<any>(null);
  const [filtered, setFiltered] = useState<PropertyResponse[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [drawCoords, setDrawCoords] = useState<number[][]>([]);

  // 🚀 Загружаем API Яндекс.Карт
  useEffect(() => {
    const apiKey = "e67fd434-4d84-4f7e-ba9e-48097b9fefb9";

    const load = async () => {
      if (window.ymaps) {
        await window.ymaps.ready();
        setYmaps(window.ymaps);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = async () => {
        await window.ymaps.ready();
        setYmaps(window.ymaps);
      };
      document.head.appendChild(script);
    };

    load();
  }, []);

  // 🗺️ Создаём карту и метки домов
  useEffect(() => {
    if (!ymaps) return;

    const m = new ymaps.Map("map", {
      center: [51.1694, 71.4491],
      zoom: 12,
      controls: ["zoomControl"],
    });

    estates.forEach((e) => {
      const lat = Number(e.latitude);
      const lng = Number(e.longitude);
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

      const placemark = new ymaps.Placemark(
        [lat, lng],
        { balloonContent: e.title ?? "Объект" },
        { preset: "islands#redIcon" }
      );
      m.geoObjects.add(placemark);
    });

    setMap(m);
    return () => m.destroy();
  }, [ymaps]);

  // ✏️ Режим рисования — зажатая мышь
  useEffect(() => {
    if (!map || !ymaps) return;

    const onMouseDown = (e: any) => {
      if (!isDrawing) return;
      setIsMouseDown(true);
      setDrawCoords([]);
      if (polygon) map.geoObjects.remove(polygon);
      setPolygon(null);
    };

    const onMouseMove = (e: any) => {
      if (!isDrawing || !isMouseDown) return;
      const coords = e.get("coords");
      setDrawCoords((prev) => [...prev, coords]);
    };

    const onMouseUp = () => {
      if (!isDrawing || !isMouseDown) return;
      setIsMouseDown(false);
      if (drawCoords.length < 3) return;

      const poly = new ymaps.Polygon(
        [drawCoords],
        {},
        {
          fillColor: "#00FF0033",
          strokeColor: "#00AA00",
          strokeWidth: 2,
        }
      );

      map.geoObjects.add(poly);
      setPolygon(poly);
      setIsDrawing(false);

      // фильтруем дома
      const inside = estates.filter((e) => {
        const lat = Number(e.latitude);
        const lng = Number(e.longitude);
        if (isNaN(lat) || isNaN(lng)) return false;
        try {
          return poly.geometry.contains([lat, lng]);
        } catch {
          return false;
        }
      });
      setFiltered(inside);
      console.log("🏠 Дома внутри выделенной области:", inside);
    };

    map.events.add("mousedown", onMouseDown);
    map.events.add("mousemove", onMouseMove);
    map.events.add("mouseup", onMouseUp);

    return () => {
      map.events.remove("mousedown", onMouseDown);
      map.events.remove("mousemove", onMouseMove);
      map.events.remove("mouseup", onMouseUp);
    };
  }, [map, ymaps, isDrawing, isMouseDown, drawCoords, estates, polygon]);

  useEffect(() => {
    if (!map) return;

    const mapContainer = map.container.getElement();

    if (isDrawing) {
      // Отключаем перетаскивание и зум
      map.behaviors.disable("drag");
      map.behaviors.disable("scrollZoom");

      // Меняем курсор на карандаш
      if (mapContainer) mapContainer.style.cursor = "crosshair";
    } else {
      // Возвращаем нормальное поведение карты
      map.behaviors.enable("drag");
      map.behaviors.enable("scrollZoom");

      // Курсор обычный
      if (mapContainer) mapContainer.style.cursor = "grab";
    }

    // При размонтировании возвращаем настройки
    return () => {
      if (mapContainer) mapContainer.style.cursor = "grab";
      map.behaviors.enable("drag");
      map.behaviors.enable("scrollZoom");
    };
  }, [map, isDrawing]);

  return (
    <div className="flex gap-4">
      {/* 🗺️ Карта */}
      <div className="w-2/3 relative">
        <div
          id="map"
          className={`h-[75vh] rounded-lg overflow-hidden border border-gray-200 ${
            isDrawing ? "cursor-crosshair" : ""
          }`}
        />
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={() => setIsDrawing((prev) => !prev)}
            className={`px-3 py-1 rounded-md text-sm font-medium shadow-md transition ${
              isDrawing
                ? "bg-red-500 text-white"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {isDrawing ? "⛔ Завершить" : "✏️ Обвести область"}
          </button>

          <button
            onClick={() => {
              if (polygon) {
                map.geoObjects.remove(polygon);
                setPolygon(null);
              }
              setFiltered([]);
            }}
            className="px-3 py-1 rounded-md text-sm font-medium shadow-md bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
          >
            ♻️ Сбросить
          </button>
        </div>
      </div>

      {/* 📋 Список домов */}
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
