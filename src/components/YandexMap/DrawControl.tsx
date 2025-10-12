import React, { useEffect, useRef, useState } from "react";
import type { PropertyResponse } from "../../api/propertyApi";

interface DrawControlProps {
  map: any;
  ymaps: any;
  estates: PropertyResponse[];
  setFilteredEstates: (data: PropertyResponse[]) => void;
}

export const DrawControl: React.FC<DrawControlProps> = React.memo(
  ({ map, ymaps, estates, setFilteredEstates }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const drawManagerRef = useRef<any>(null);
    const objectManagerRef = useRef<any>(null);
    const polygonRef = useRef<any>(null);

    useEffect(() => {
      if (!map || !ymaps) return;

      // Ждём, пока карта реально будет готова
      ymaps.ready(() => {
        // создаём ObjectManager только один раз
        if (!objectManagerRef.current) {
          objectManagerRef.current = new ymaps.ObjectManager({
            clusterize: true,
            gridSize: 64,
          });
          map.geoObjects.add(objectManagerRef.current);
          console.log("✅ ObjectManager инициализирован");
        }

        const objectManager = objectManagerRef.current;

        // 💡 ждём 300мс, чтобы карта успела полностью построиться
        setTimeout(() => {
          if (!objectManager) {
            console.warn("⚠️ ObjectManager ещё не готов");
            return;
          }

          // фильтруем валидные координаты
          const features = estates
            .filter(
              (e) =>
                e.latitude &&
                e.longitude &&
                !isNaN(Number(e.latitude)) &&
                !isNaN(Number(e.longitude))
            )
            .map((e, idx) => ({
              type: "Feature",
              id: idx,
              geometry: {
                type: "Point",
                coordinates: [Number(e.latitude), Number(e.longitude)],
              },
              properties: { title: e.title ?? "Объект" },
            }));

          console.log("Добавляем features:", features.length);

          // добавляем коллекцию точек
          objectManager.add({
            type: "FeatureCollection",
            features,
          });
        }, 300);

        // DrawingManager для обводки
        const drawManager = new ymaps.control.DrawingManager({
          drawingModes: ["polygon"],
        });
        map.controls.add(drawManager);
        drawManagerRef.current = drawManager;

        // обработка завершения рисования
        drawManager.events.add("overlaychange", (e: any) => {
          const overlay = e.get("newGeometry");
          if (!overlay) return;

          const polygon = overlay.getGeometry();
          polygonRef.current = polygon;

          // фильтруем объекты внутри полигона
          objectManager.setFilter((obj: any) => {
            const [lat, lng] = obj.geometry.coordinates;
            return polygon.contains([lat, lng]);
          });
        });

        return () => {
          map.controls.remove(drawManager);
        };
      });
    }, [map, ymaps, estates]);

    return (
      <button
        onClick={() => {
          if (!drawManagerRef.current) return;
          if (isDrawing) {
            drawManagerRef.current.setDrawingMode(null);
            setIsDrawing(false);
          } else {
            drawManagerRef.current.setDrawingMode("polygon");
            setIsDrawing(true);
          }
        }}
        className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-md text-sm font-medium shadow-md transition ${
          isDrawing
            ? "bg-red-500 text-white"
            : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
        }`}
      >
        {isDrawing ? "⛔ Завершить выделение" : "✏️ Обвести область"}
      </button>
    );
  }
);
