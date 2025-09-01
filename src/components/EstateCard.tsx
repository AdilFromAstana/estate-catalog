import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Square, Ruler, Heart, Eye } from "lucide-react";
import type { Estate } from "../contants/estates";

const EstateCard: React.FC<Estate> = ({
  id,
  category,
  city,
  district,
  price,
  pricePerSquare,
  totalArea,
  roomCount,
  floor,
  totalFloors,
  images,
  amenities,
  status,
  views,
  agent,
  newBuilding,
}) => {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ₸`;
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      apartment: "Квартира",
      house: "Дом",
      commercial: "Коммерческая",
      land: "Участок",
      townhouse: "Таунхаус",
    };
    return labels[category] || category;
  };

  return (
    <Link
      to={`/estate/${id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={images[0] || "/placeholder-estate.jpg"}
          alt={district}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : status === "reserved"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status === "active"
              ? "Активно"
              : status === "reserved"
              ? "Забронировано"
              : "Продано"}
          </span>
        </div>

        {/* New Building Badge */}
        {newBuilding && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
              Новостройка
            </span>
          </div>
        )}

        {/* Views Counter */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full">
          <Eye size={14} />
          <span className="text-xs">{views}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-3">
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(price)}
          </p>
          {pricePerSquare && (
            <p className="text-sm text-gray-600">
              {Math.round(pricePerSquare).toLocaleString()} ₸/м²
            </p>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
          {getCategoryLabel(category)}, {roomCount}-комнатная
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <MapPin size={14} />
          <span className="text-sm">
            {district}, {city}
          </span>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <Square size={14} />
            <span>{totalArea} м²</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <Bed size={14} />
            <span>{roomCount} комн.</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-700">
            <Ruler size={14} />
            <span>
              {floor}/{totalFloors} эт.
            </span>
          </div>
        </div>

        {/* Amenities */}
        {amenities && amenities.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {amenity}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  +{amenities.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Agent Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img
              // src={agent.avatar || "/placeholder-agent.jpg"}
              src={
                "https://avatars.mds.yandex.net/i?id=4befe74649a710df0b066c24bf40f767_l-5869782-images-thumbs&n=13"
              }
              alt={agent.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-gray-600">{agent.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Add to favorites logic
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EstateCard;
