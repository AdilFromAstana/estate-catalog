// components/MapView.tsx
import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Estate } from "../contants/estates";

// Фикс для иконок
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapViewProps {
  estates: Estate[];
  onEstateClick: (estate: Estate) => void;
}

const MapView: React.FC<MapViewProps> = ({ estates, onEstateClick }) => {
  if (estates.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Нет объектов для отображения на карте</p>
      </div>
    );
  }

  // Средние координаты для центра карты
  const centerLat =
    estates.reduce((sum, estate) => sum + estate.coordinates.lat, 0) /
    estates.length;
  const centerLng =
    estates.reduce((sum, estate) => sum + estate.coordinates.lng, 0) /
    estates.length;

  return (
    <div className="h-[75vh] rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {estates.map((estate) => (
          <Marker
            key={estate.id}
            position={[estate.coordinates.lat, estate.coordinates.lng]}
            eventHandlers={{
              click: () => onEstateClick(estate),
            }}
          ></Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
