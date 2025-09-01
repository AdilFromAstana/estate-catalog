import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Фикс для иконок маркеров
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Компонент для обновления карты
const MapUpdater: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);

  return null;
};

interface OpenStreetMapProps {
  lat: number;
  lng: number;
  address: string;
}

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({ lat, lng, address }) => {
  return (
    <div className="mb-6 relative" style={{ zIndex: 1 }}>
      <h2 className="text-xl font-semibold mb-3">Расположение на карте</h2>
      <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          style={{
            height: "100%",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
          scrollWheelZoom={false}
        >
          <MapUpdater lat={lat} lng={lng} />{" "}
          {/* Добавляем компонент обновления */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">Объект недвижимости</div>
                <div>{address}</div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Объект расположен по адресу: {address}
      </p>
    </div>
  );
};

export default OpenStreetMap;
