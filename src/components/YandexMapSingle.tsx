import React, { useEffect, useState } from "react";

interface YandexMapSingleProps {
  lat: number;
  lng: number;
  address: string;
}

const YandexMapSingle: React.FC<YandexMapSingleProps> = ({ lat, lng, address }) => {
  const [ymaps, setYmaps] = useState<any>(null);
  const [map, setMap] = useState<any>(null);
  console.log(map)

  // Загрузка API Яндекс.Карт
  useEffect(() => {
    const apiKey = "e67fd434-4d84-4f7e-ba9e-48097b9fefb9";

    const loadYmaps = () => {
      if ((window as any).ymaps) {
        (window as any).ymaps.ready(() => setYmaps((window as any).ymaps));
        return;
      }

      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        (window as any).ymaps.ready(() => setYmaps((window as any).ymaps));
      };
      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };

    loadYmaps();
  }, []);

  // Инициализация карты
  useEffect(() => {
    if (!ymaps || !lat || !lng) return;

    const m = new ymaps.Map("single-map", {
      center: [lat, lng],
      zoom: 15,
      controls: ["zoomControl"],
      suppressMapOpenBlock: true,
      yandexMapDisablePoiInteractivity: true,
    });

    [
      "searchControl",
      "trafficControl",
      "typeSelector",
      "fullscreenControl",
      "rulerControl",
    ].forEach((ctrl) => {
      if (m.controls.get(ctrl)) m.controls.remove(ctrl);
    });

    const customRedIconUrl = "https://cdn-icons-png.flaticon.com/512/447/447031.png";

    const placemark = new ymaps.Placemark(
      [lat, lng],
      "",
      {
        iconLayout: "default#image",
        iconImageHref: customRedIconUrl,
        iconImageSize: [32, 32],        // размер иконки в пикселях
        iconImageOffset: [-16, -32],    // смещение, чтобы иконка была по центру над точкой
      }
    );

    m.geoObjects.add(placemark);
    setMap(m);

    return () => {
      m.destroy();
    };
  }, [ymaps, lat, lng, address]);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Расположение на карте</h2>
      <div
        id="single-map"
        className="h-64 rounded-lg overflow-hidden border border-gray-200"
        style={{ minHeight: "256px" }}
      />
    </div>
  );
};

export default YandexMapSingle;