import React, { useState } from "react";
import EstateCard from "../components/EstateCard";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import { List, Map } from "lucide-react";
import {
  type GetPropertiesParams,
  type PropertyResponse,
} from "../api/propertyApi";
import { useProperties } from "../hooks/useProperties";
import { useCities, useDistricts } from "../hooks/useCities";
import MapViewYandex from "../components/MapViewYandex";
import { PropertyStatus } from "../contants/property-status";

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

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Состояние фильтров
  const [filters, setFilters] = useState<GetPropertiesParams>({
    cityId: undefined,
    districtId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minArea: undefined,
    maxArea: undefined,
    rooms: undefined,
    maxFloor: undefined,
    minFloor: undefined,
    agencyId: 1,
  });

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEstate, setSelectedEstate] = useState<PropertyResponse | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);

  // ✅ формируем query-параметры для API
  const params = {
    page: 1,
    limit: 100,
    search: searchQuery || undefined,
    cityId: filters.cityId || undefined,
    districtId: filters.districtId || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    minArea: filters.minArea || undefined,
    maxArea: filters.maxArea || undefined,
    agencyId: filters.agencyId,
    isPublished: true,
    status: PropertyStatus.ACTIVE,
  };

  const { data, isLoading, error } = useProperties(params);
  const { data: cities } = useCities();
  const { data: districts } = useDistricts(filters.cityId!);

  const estates = data?.data ?? [];
  const total = data?.total ?? 0;

  console.log("error: ", error);
  console.log("total: ", total);

  // Обработчики
  const handleEstateClick = (estate: PropertyResponse) => {
    if (viewMode === "map") {
      setSelectedEstate(estate);
      setIsModalOpen(true);
      setIsModalClosing(false);
    } else {
      navigate(`/estate/${estate.id}`);
    }
  };

  const handleModalClose = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsModalClosing(false);
      setSelectedEstate(null);
    }, 300);
  };

  const handleViewDetails = () => {
    if (selectedEstate) {
      handleModalClose();
      setTimeout(() => {
        navigate(`/estate/${selectedEstate.id}`);
      }, 300);
    }
  };

  const updateFilter = <K extends keyof GetPropertiesParams>(
    key: K,
    value: GetPropertiesParams[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      agencyId: 1,
    });
    setSearchQuery("");
  };

  // Подготовка данных для SearchBar
  const categories = ["apartment", "house", "commercial", "land", "townhouse"];
  const roomOptions = [1, 2, 3, 4, 5];
  const maxPrice = estates.length
    ? Math.max(...estates.map((e) => e.price))
    : 100000000;

  return (
    <main className="flex-1 p-4 relative">
      <SearchBar
        onSearch={setSearchQuery}
        filters={filters}
        onFilterChange={updateFilter}
        onResetFilters={resetFilters}
        filterOptions={{
          categories,
          cities: cities || [], // передаём города
          districts: districts || [], // передаём районы
          maxPrice,
          rooms: roomOptions,
          minFloor: null,
          maxFloor: null,
          buildingType: [],
          condition: [],
          amenities: [],
          hasPhoto: null,
          minCeilingHeight: null,
        }}
        filteredEstatesLength={estates.length}
      />

      <div className="mb-4">
        <p className="text-gray-600">
          Найдено {estates.length} объектов
          {searchQuery && ` по запросу "${searchQuery}"`}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Загрузка объектов...</p>
        </div>
      ) : estates.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏢</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ничего не найдено
          </h3>
          <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
        </div>
      ) : (
        <>
          {viewMode === "list" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {estates.map((estate) => (
                <EstateCard key={estate.id} {...estate} />
              ))}
            </div>
          ) : (
            // <MapView estates={estates} onEstateClick={handleEstateClick} />
            <MapViewYandex
              estates={estates}
              onEstateClick={handleEstateClick}
            />
          )}
        </>
      )}

      {/* Кнопка переключения режима */}
      <div className="fixed bottom-20 right-6 z-[1000]">
        <button
          onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          {viewMode === "list" ? <Map size={24} /> : <List size={24} />}
        </button>
      </div>

      {/* Модальное окно */}
      {isModalOpen && selectedEstate && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center">
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isModalClosing ? "opacity-0" : "opacity-50"
            }`}
            onClick={handleModalClose}
          />
          <div
            className={`relative bg-white rounded-t-2xl w-full max-w-md ${
              isModalClosing ? "animate-slide-down" : "animate-slide-up"
            }`}
            style={{ maxHeight: "80svh" }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Информация о недвижимости
              </h3>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(80svh - 120px)" }}
            >
              <div className="p-4">
                {selectedEstate.photos?.[0] && (
                  <img
                    src={selectedEstate.photos[0]}
                    alt={getCategoryLabel(selectedEstate.type)}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="space-y-3">
                  <h2 className="text-xl font-bold">
                    {getCategoryLabel(selectedEstate.type)}
                  </h2>
                  <p className="text-gray-600">
                    {selectedEstate.district}, {selectedEstate.street}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {selectedEstate.price.toLocaleString()} ₸
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {selectedEstate.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Площадь:</span>{" "}
                      {selectedEstate.area} м²
                    </div>
                    <div>
                      <span className="font-medium">Комнат:</span>{" "}
                      {selectedEstate.rooms}
                    </div>
                    <div>
                      <span className="font-medium">Этаж:</span>{" "}
                      {selectedEstate.floor}/{selectedEstate.totalFloors}
                    </div>
                    {selectedEstate.condition && (
                      <div>
                        <span className="font-medium">Состояние:</span>{" "}
                        {selectedEstate.condition}
                      </div>
                    )}
                  </div>
                  {selectedEstate.description && (
                    <div className="mt-3">
                      <h4 className="font-medium mb-1">Описание:</h4>
                      <p className="text-gray-700 text-sm">
                        {selectedEstate.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={handleViewDetails}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Подробнее
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slide-down { from { transform: translateY(0); } to { transform: translateY(100%); } }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
      `}</style>
    </main>
  );
};

export default HomePage;
