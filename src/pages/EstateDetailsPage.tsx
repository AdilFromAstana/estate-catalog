// src/pages/EstateDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Heart, Share2 } from "lucide-react";
// import EstateCarousel from "../components/EstateCarousel";
import ImageModal from "../components/ImageModal";
import EstateContactButtons from "../components/EstateContactButtons";
import EstateLoanCalculator from "../components/EstateLoanCalculator";
import EstateImageGallery from "../components/EstateImageGallery";
import EstateQuickStats from "../components/EstateQuickStats";
// import { useSimilarEstates } from "../hooks/useSimilarEstates";
import OpenStreetMap from "../components/OpenStreetMap";
import {
  formatFullName,
  formatPrice,
  propertyApi,
  type PropertyResponse,
} from "../api/propertyApi";
import toast from "react-hot-toast";
import { getAvatar } from "../hooks/useRealtor";

// Хелпер для отображения типа недвижимости
const getCategoryLabel = (type: string) => {
  const labels: Record<string, string> = {
    apartment: "Квартира",
    house: "Дом",
    commercial: "Коммерческая",
    land: "Участок",
    townhouse: "Таунхаус",
  };
  return labels[type] || type;
};

// Хелпер для отображения состояния ремонта
const getConditionLabel = (condition: string) => {
  const labels: Record<string, string> = {
    without: "Без ремонта",
    cosmetic: "Косметический",
    euro: "Евроотделка",
    designer: "Дизайнерский",
    rough: "Черновая",
    turnkey: "Под ключ",
  };
  return labels[condition] || condition;
};

const EstateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [estate, setEstate] = useState<PropertyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Загрузка данных
  useEffect(() => {
    const fetchEstate = async () => {
      if (!id) {
        setError("ID объекта не указан");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await propertyApi.getById(Number(id));
        setEstate(data);
      } catch (err: any) {
        console.error("Ошибка загрузки объекта:", err);
        setError(
          err.response?.status === 404
            ? "Объект не найден"
            : "Не удалось загрузить информацию об объекте"
        );
        toast.error(error || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchEstate();
  }, [id]);

  useEffect(() => {
    if (estate) {
      window.scrollTo({ top: 0 });
    }
  }, [estate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Загрузка объекта...</p>
        </div>
      </div>
    );
  }

  if (error || !estate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Объект не найден"}
          </h1>
          <p className="text-gray-600">
            {error === "Объект не найден"
              ? "Запрошенный объект недвижимости не существует"
              : "Произошла ошибка при загрузке данных"}
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

      <EstateImageGallery photos={estate.photos} />

      {modalOpen && (
        <ImageModal
          images={estate.photos || []}
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
            {estate.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin size={16} />
            <span className="text-sm">
              {estate.district}, {estate.street}, {estate.city}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(estate.price)}
            </span>
            {estate.area > 0 && (
              <span className="text-gray-600">
                {Math.round(estate.price / estate.area).toLocaleString()} ₸/м²
              </span>
            )}
          </div>
        </div>

        {estate.coordinates && (
          <OpenStreetMap
            lat={estate.coordinates?.lat || 0}
            lng={estate.coordinates?.lng || 0}
            address={fullAddress}
          />
        )}

        {/* Quick Stats */}
        <EstateQuickStats estate={estate} />

        {/* Contact Buttons */}
        <EstateContactButtons />

        {/* Loan Calculator */}
        <EstateLoanCalculator price={estate.price} id={estate.id!} />

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Описание</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {estate.description}
          </div>
        </div>

        {/* Details Section */}
        <EstateDetailsSection estate={estate} />

        {/* Amenities Section */}
        {/* <EstateAmenitiesSection estate={estate} /> */}

        {/* Agent Info Section */}
        <EstateAgentSection estate={estate} />

        {/* Similar Estates — временно отключено, пока нет API */}
        {/* <SimilarEstatesSections estate={estate} /> */}
      </div>
    </div>
  );
};

// Обновлённые компоненты под PropertyDto
const EstateDetailsSection: React.FC<{ estate: PropertyResponse }> = ({
  estate,
}) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-3">Характеристики</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Тип недвижимости</span>
          <span className="font-medium">{getCategoryLabel(estate.type)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Район</span>
          <span className="font-medium">{estate.district}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Улица</span>
          <span className="font-medium">{estate.street}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Состояние ремонта</span>
          <span className="font-medium">
            {estate.condition ? getConditionLabel(estate.condition) : "-"}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Общая площадь</span>
          <span className="font-medium">{estate.area} м²</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Комнат</span>
          <span className="font-medium">{estate.rooms}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Этаж</span>
          <span className="font-medium">
            {estate.floor}/{estate.totalFloors}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Год постройки</span>
          <span className="font-medium">{estate.yearBuilt || "-"}</span>
        </div>
      </div>
    </div>
  </div>
);

// const EstateAmenitiesSection: React.FC<{ estate: PropertyDto }> = ({
//   estate,
// }) =>
//   estate?.amenities &&
//   estate?.amenities.length > 0 && (
//     <div className="mb-6">
//       <h2 className="text-xl font-semibold mb-3">Удобства</h2>
//       <div className="flex flex-wrap gap-2">
//         {estate.amenities.map((amenity, index) => (
//           <span
//             key={index}
//             className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
//           >
//             {amenity}
//           </span>
//         ))}
//       </div>
//     </div>
//   );

const EstateAgentSection: React.FC<{ estate: PropertyResponse }> = ({
  estate,
}) => (
  <div className="mb-8 p-4 bg-gray-50 rounded-xl">
    <h2 className="text-xl font-semibold mb-3">Контактное лицо</h2>
    <div className="flex items-center gap-3">
      <img
        src={getAvatar(estate.owner?.avatar!)}
        alt={formatFullName({
          firstName: estate.owner?.firstName,
          lastName: estate.owner?.lastName,
        })}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <div className="font-semibold">
          {formatFullName({
            firstName: estate.owner?.firstName,
            lastName: estate.owner?.lastName,
          })}
        </div>
        <div className="text-sm text-gray-600">{estate.agency?.name}</div>
        <div className="text-sm text-blue-600">
          {estate.owner?.phone || "Нет телефона"}
        </div>
      </div>
    </div>
  </div>
);

export default EstateDetailsPage;
