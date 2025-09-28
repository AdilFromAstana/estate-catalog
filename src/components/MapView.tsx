import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { PropertyResponse } from "../api/propertyApi";

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
  estates: PropertyResponse[];
  onEstateClick: (estate: PropertyResponse) => void;
}

const MapView: React.FC<MapViewProps> = ({ estates, onEstateClick }) => {
  // оставляем только те объекты, у которых есть координаты
  const estatesWithCoords = estates.filter(
    (e) => e.coordinates && e.coordinates.lat && e.coordinates.lng
  );

  if (estatesWithCoords.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Нет объектов для отображения на карте</p>
      </div>
    );
  }

  // Средние координаты для центра карты
  const centerLat =
    estatesWithCoords.reduce((sum, e) => sum + (e.coordinates?.lat ?? 0), 0) /
    estatesWithCoords.length;
  const centerLng =
    estatesWithCoords.reduce((sum, e) => sum + (e.coordinates?.lng ?? 0), 0) /
    estatesWithCoords.length;

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
        {estatesWithCoords.map((estate) => (
          <Marker
            key={estate.id}
            position={[estate.coordinates!.lat, estate.coordinates!.lng]}
            eventHandlers={{
              click: () => onEstateClick(estate),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
