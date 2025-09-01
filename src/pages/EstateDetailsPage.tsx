import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Heart, Share2 } from "lucide-react";
import { astanaEstates, type Estate } from "../contants/estates";
import EstateCarousel from "../components/EstateCarousel";
import ImageModal from "../components/ImageModal";
import EstateContactButtons from "../components/EstateContactButtons";
import EstateLoanCalculator from "../components/EstateLoanCalculator";
import EstateImageGallery from "../components/EstateImageGallery";
import EstateQuickStats from "../components/EstateQuickStats";
import { useSimilarEstates } from "../hooks/useSimilarEstates";
import OpenStreetMap from "../components/OpenStreetMap";

const EstateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const estate = astanaEstates.find((e) => e.id === id);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { similarByPrice, sameDistrict, similarByRooms, mostSimilar } =
    useSimilarEstates(estate!);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!estate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Объект не найден
          </h1>
          <p className="text-gray-600">
            Запрошенный объект недвижимости не существует
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const fullAddress = `${estate.city}, ${estate.district}, ${estate.street} ${estate.houseNumber}`;

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
            >
              <Heart
                size={20}
                className={
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }
              />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition">
              <Share2 size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <EstateImageGallery estate={estate} onImageClick={handleImageClick} />

      {modalOpen && (
        <ImageModal
          images={estate.images}
          currentIndex={currentImageIndex}
          setCurrentIndex={setCurrentImageIndex}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="p-4">
        {/* Price and Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {estate.roomCount}-комнатная{" "}
            {estate.category === "apartment" ? "квартира" : "недвижимость"},{" "}
            {estate.totalArea} м²
          </h1>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin size={16} />
            <span className="text-sm">
              {estate.district}, {estate.microdistrict || estate.street},{" "}
              {estate.city}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">
              {estate.price.toLocaleString()} ₸
            </span>
            {estate.pricePerSquare && (
              <span className="text-gray-600">
                {Math.round(estate.pricePerSquare).toLocaleString()} ₸/м²
              </span>
            )}
          </div>
        </div>

        <OpenStreetMap
          lat={estate.coordinates.lat}
          lng={estate.coordinates.lng}
          address={fullAddress}
        />
        {/* Quick Stats */}
        <EstateQuickStats estate={estate} />

        {/* Contact Buttons */}
        <EstateContactButtons />

        {/* Loan Calculator */}
        <EstateLoanCalculator price={estate.price} id={estate.id} />

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Описание</h2>
          <p className="text-gray-700 leading-relaxed">{estate.description}</p>
        </div>

        {/* Details Section */}
        <EstateDetailsSection estate={estate} />

        {/* Amenities Section */}
        <EstateAmenitiesSection estate={estate} />

        {/* Agent Info Section */}
        <EstateAgentSection estate={estate} />

        {/* Similar Estates */}
        <SimilarEstatesSections
          estate={estate}
          mostSimilar={mostSimilar}
          similarByPrice={similarByPrice}
          sameDistrict={sameDistrict}
          similarByRooms={similarByRooms}
        />
      </div>
    </div>
  );
};

// Дополнительные компоненты для секций
const EstateDetailsSection: React.FC<{ estate: Estate }> = ({ estate }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-3">Характеристики</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Тип недвижимости</span>
          <span className="font-medium">
            {estate.category === "apartment" ? "Квартира" : "Дом"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Район</span>
          <span className="font-medium">{estate.district}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Микрорайон</span>
          <span className="font-medium">{estate.microdistrict || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Улица</span>
          <span className="font-medium">{estate.street}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Общая площадь</span>
          <span className="font-medium">{estate.totalArea} м²</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Жилая площадь</span>
          <span className="font-medium">{estate.livingArea || "-"} м²</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Кухня</span>
          <span className="font-medium">{estate.kitchenArea || "-"} м²</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Этаж</span>
          <span className="font-medium">
            {estate.floor}/{estate.totalFloors}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const EstateAmenitiesSection: React.FC<{ estate: Estate }> = ({ estate }) =>
  estate.amenities &&
  estate.amenities.length > 0 && (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Удобства</h2>
      <div className="flex flex-wrap gap-2">
        {estate.amenities.map((amenity, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {amenity}
          </span>
        ))}
      </div>
    </div>
  );

const EstateAgentSection: React.FC<{ estate: Estate }> = ({ estate }) => (
  <div className="mb-8 p-4 bg-gray-50 rounded-xl">
    <h2 className="text-xl font-semibold mb-3">Контактное лицо</h2>
    <div className="flex items-center gap-3">
      <img
        src="https://avatars.mds.yandex.net/i?id=4befe74649a710df0b066c24bf40f767_l-5869782-images-thumbs&n=13"
        alt={estate.agent.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <div className="font-semibold">{estate.agent.name}</div>
        <div className="text-sm text-gray-600">{estate.agency.name}</div>
        <div className="text-sm text-blue-600">{estate.agent.phone}</div>
      </div>
    </div>
  </div>
);

const SimilarEstatesSections: React.FC<{
  estate: Estate;
  mostSimilar: Estate[];
  similarByPrice: Estate[];
  sameDistrict: Estate[];
  similarByRooms: Estate[];
}> = ({
  estate,
  mostSimilar,
  similarByPrice,
  sameDistrict,
  similarByRooms,
}) => (
  <>
    {mostSimilar.length > 0 && (
      <EstateCarousel title="Самые похожие варианты" estates={mostSimilar} />
    )}

    {similarByPrice.length > 0 && mostSimilar.length === 0 && (
      <EstateCarousel
        title="Похожие по бюджету"
        estates={similarByPrice.slice(0, 6)}
      />
    )}

    {sameDistrict.length > 0 && (
      <EstateCarousel
        title="Другие варианты в этом районе"
        estates={sameDistrict.slice(0, 6)}
      />
    )}

    {similarByRooms.length > 0 && (
      <EstateCarousel
        title={`Другие ${estate.roomCount}-комнатные ${
          estate.category === "apartment" ? "квартиры" : "объекты"
        }`}
        estates={similarByRooms.slice(0, 6)}
      />
    )}
  </>
);

export default EstateDetailsPage;
