import React, { useEffect, useState } from "react";
import MapControls from "./MapControls";
import DrawingTool from "./DrawingTool";
import useMapClusters from "./useMapClusters";
import type { MapContainerProps, MapInstance, PolylineInstance } from "../../../../types";

const MapContainer: React.FC<MapContainerProps> = ({
  estates,
  setFiltered,
  polygon,
  setPolygon,
}) => {
  const [ymaps, setYmaps] = useState<Window["ymaps"] | null>(null);
  const [map, setMap] = useState<MapInstance | null>(null);
  const [polyline, setPolyline] = useState<PolylineInstance | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // 🚀 Загружаем API Яндекс.Карт
  useEffect(() => {
    const apiKey = "e67fd434-4d84-4f7e-ba9e-48097b9fefb9";
    const load = async () => {
      if ((window as any).ymaps) {
        await (window as any).ymaps.ready();
        setYmaps((window as any).ymaps);
        return;
      }
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = async () => {
        await (window as any).ymaps.ready();
        setYmaps((window as any).ymaps);
      };
      document.head.appendChild(script);
    };
    load();
  }, []);

  useEffect(() => {
    if (!ymaps) return;

    const m = new ymaps.Map("map", {
      center: [51.1694, 71.4491],
      zoom: 12,
      controls: ["zoomControl"],
      suppressMapOpenBlock: true, // 🚫 блокирует бизнес-баллуны
      yandexMapDisablePoiInteractivity: true,
    });

    // Удаляем все ненужные контролы
    [
      "searchControl",
      "trafficControl",
      "typeSelector",
      "fullscreenControl",
      "rulerControl",
    ].forEach((ctrl) => {
      if (m.controls.get(ctrl)) m.controls.remove(ctrl);
    });

    // Поведение карты
    m.behaviors.enable("drag");
    m.behaviors.enable("scrollZoom");

    // 🧱 Самое важное — отключаем бизнес-слой, даже если он подгрузился позже
    const removeBusinessLayers = () => {
      const layers = m.layers || [];
      layers.each?.((layer: any) => {
        const type = layer?.getMapType?.();
        if (type && type.includes("business")) {
          m.layers.remove(layer);
          console.log("🧹 Убран бизнес-слой:", type);
        }
      });
    };

    // Проверяем несколько раз — иногда слой подгружается с задержкой
    removeBusinessLayers();
    setTimeout(removeBusinessLayers, 1000);
    setTimeout(removeBusinessLayers, 3000);

    // 🚫 Перехватываем клики по карте, чтобы бизнес-баллуны не всплывали
    m.events.add("click", (e: any) => {
      e.preventDefault();
      e.stopPropagation();
    });

    // 🔵 ObjectManager
    const manager = new ymaps.ObjectManager({
      clusterize: true,
      gridSize: 64,
    });

    manager.clusters.options.set({
      preset: "islands#blueClusterIcons",
    });

    manager.objects.options.set({
      iconLayout: "default#image",
      iconImageHref: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
      iconImageSize: [18, 18],
      iconImageOffset: [-9, -9],
    });

    const features = estates
      .filter((e) => e.latitude && e.longitude)
      .map((e) => ({
        type: "Feature",
        id: e.id,
        geometry: { type: "Point", coordinates: [e.latitude, e.longitude] },
        properties: { balloonContent: e.title ?? "Объект" },
      }));

    manager.add({ type: "FeatureSelection", features });
    m.geoObjects.add(manager);

    setMap(m);

    return () => m.destroy();
  }, [ymaps, estates]);

  // 📦 кластеризация
  useMapClusters({ map, estates, polygon, setFiltered });

  return (
    <div className="w-2/3 relative">
      <div
        id="map"
        className="h-full rounded-lg overflow-hidden border border-gray-200"
      />
      <MapControls
        map={map}
        polygon={polygon}
        setPolygon={setPolygon}
        polyline={polyline}
        setPolyline={setPolyline}
        estates={estates}
        setFiltered={setFiltered}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
      />
      <DrawingTool
        map={map}
        ymaps={ymaps}
        isDrawing={isDrawing}
        estates={estates}
        polygon={polygon}
        setPolygon={setPolygon}
        setFiltered={setFiltered}
      />
    </div>
  );
};

export default MapContainer;
