import React, { useState } from "react";
import EstateCard from "../components/EstateCard";
import SearchBar from "../components/SearchBar";
import { astanaEstates, type Estate, type Filters } from "../contants/estates";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import { List, Map } from "lucide-react";

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
  const [filters, setFilters] = useState<Filters>({
    category: null,
    district: null,
    minPrice: null,
    maxPrice: null,
    minArea: null,
    maxArea: null,
    rooms: [],
    minFloor: null,
    maxFloor: null,
    buildingType: [],
    renovation: [],
    condition: [],
    amenities: [],
    hasPhoto: null,
    isExclusive: null,
    newBuilding: null,
    minCeilingHeight: null,
  });
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEstate, setSelectedEstate] = useState<Estate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);

  const handleEstateClick = (estate: Estate) => {
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
    }, 300); // Должно совпадать с длительностью анимации
  };

  const handleViewDetails = () => {
    if (selectedEstate) {
      handleModalClose();
      setTimeout(() => {
        navigate(`/estate/${selectedEstate.id}`);
      }, 300);
    }
  };

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () =>
    setFilters({
      category: null,
      district: null,
      minPrice: null,
      maxPrice: null,
      maxArea: null,
      minArea: null,
      rooms: [],
      minFloor: null,
      maxFloor: null,
      buildingType: [],
      renovation: [],
      condition: [],
      amenities: [],
      hasPhoto: null,
      isExclusive: null,
      newBuilding: null,
      minCeilingHeight: null,
    });

  const filteredEstates = astanaEstates.filter((estate) => {
    const matchesSearch =
      estate.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estate.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (estate.microdistrict &&
        estate.microdistrict
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      estate.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filters.category
      ? estate.category === filters.category
      : true;
    const matchesDistrict = filters.district
      ? estate.district === filters.district
      : true;

    const matchesPrice =
      (filters.minPrice ? estate.price >= filters.minPrice : true) &&
      (filters.maxPrice ? estate.price <= filters.maxPrice : true);

    const matchesRooms = filters.rooms?.length
      ? filters.rooms.includes(estate.roomCount)
      : true;

    const matchesArea =
      (filters.minArea ? estate.totalArea >= filters.minArea : true) &&
      (filters.maxArea ? estate.totalArea <= filters.maxArea : true);

    const matchesFloor =
      (filters.minFloor ? estate.floor >= filters.minFloor : true) &&
      (filters.maxFloor ? estate.floor <= filters.maxFloor : true);

    const matchesRenovation = filters.renovation?.length
      ? filters.renovation.includes(estate.renovation || "without")
      : true;

    const matchesAmenities = filters.amenities?.length
      ? filters.amenities.every((amenity) => estate.amenities.includes(amenity))
      : true;

    const matchesHasPhoto = filters.hasPhoto ? estate.images.length > 0 : true;

    const matchesExclusive = filters.isExclusive
      ? estate.isExclusive === true
      : true;

    const matchesNewBuilding = filters.newBuilding
      ? estate.newBuilding !== undefined
      : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDistrict &&
      matchesPrice &&
      matchesArea &&
      matchesRooms &&
      matchesFloor &&
      matchesRenovation &&
      matchesAmenities &&
      matchesHasPhoto &&
      matchesExclusive &&
      matchesNewBuilding
    );
  });

  const categories = Array.from(new Set(astanaEstates.map((e) => e.category)));
  const districts = Array.from(new Set(astanaEstates.map((e) => e.district)));
  const maxPrice = Math.max(...astanaEstates.map((e) => e.price));

  return (
    <main className="flex-1 p-4 relative">
      <SearchBar
        onSearch={setSearchQuery}
        filters={filters}
        onFilterChange={updateFilter}
        onResetFilters={resetFilters}
        filterOptions={{
          categories,
          districts,
          maxPrice,
          rooms: [],
          minFloor: null,
          maxFloor: null,
          buildingType: [],
          renovation: [],
          condition: [],
          amenities: [],
          hasPhoto: null,
          isExclusive: null,
          newBuilding: null,
          minCeilingHeight: null,
        }}
        filteredEstatesLength={filteredEstates.length}
      />

      <div className="mb-4">
        <p className="text-gray-600">
          Найдено {filteredEstates.length} объектов
          {searchQuery && ` по запросу "${searchQuery}"`}
        </p>
      </div>

      {filteredEstates.length === 0 ? (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEstates.map((estate) => (
                <EstateCard key={estate.id} {...estate} />
              ))}
            </div>
          ) : (
            <MapView
              estates={filteredEstates}
              onEstateClick={handleEstateClick}
            />
          )}
        </>
      )}

      {/* Кнопка переключения режима просмотра */}
      <div className="fixed bottom-20 right-6 z-[1000]">
        <button
          onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          {viewMode === "list" ? <Map size={24} /> : <List size={24} />}
        </button>
      </div>

      {/* Модальное окно с информацией о недвижимости */}
      {isModalOpen && selectedEstate && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center">
          {/* Фоновое затемнение */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isModalClosing ? "opacity-0" : "opacity-50"
            }`}
            onClick={handleModalClose}
          />

          {/* Модальное окно */}
          <div
            className={`relative bg-white rounded-t-2xl w-full max-w-md ${
              isModalClosing ? "animate-slide-down" : "animate-slide-up"
            }`}
            style={{ maxHeight: "80svh" }}
          >
            {/* Заголовок модального окна с кнопкой закрытия */}
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

            {/* Содержимое модального окна */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(80svh - 120px)" }}
            >
              <div className="p-4">
                {/* Изображение недвижимости */}
                {selectedEstate.images && selectedEstate.images.length > 0 && (
                  <div className="mb-4">
                    <img
                      src={selectedEstate.images[0]}
                      alt={getCategoryLabel(selectedEstate.category)}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Основная информация */}
                <div className="space-y-3">
                  <h2 className="text-xl font-bold">
                    {getCategoryLabel(selectedEstate.category)}
                  </h2>
                  <p className="text-gray-600">
                    {selectedEstate.district}, {selectedEstate.street}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {selectedEstate.price.toLocaleString()} ₸
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {selectedEstate.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Площадь:</span>{" "}
                      {selectedEstate.totalArea} м²
                    </div>
                    <div>
                      <span className="font-medium">Комнат:</span>{" "}
                      {selectedEstate.roomCount}
                    </div>
                    <div>
                      <span className="font-medium">Этаж:</span>{" "}
                      {selectedEstate.floor}/{selectedEstate.totalFloors}
                    </div>
                    {selectedEstate.renovation && (
                      <div>
                        <span className="font-medium">Ремонт:</span>{" "}
                        {selectedEstate.renovation}
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

            {/* Кнопка "Подробнее" */}
            <div className="p-4 border-t">
              <button
                onClick={handleViewDetails}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Подробнее
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

export default HomePage;
