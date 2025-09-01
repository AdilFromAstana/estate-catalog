import React, { useState } from "react";
import EstateCard from "../components/EstateCard";
import SearchBar from "../components/SearchBar";
import { astanaEstates, type Filters } from "../contants/estates";
// import { useNavigate } from "react-router-dom";
// import MapView from "../components/MapView";
// import { List, Map } from "lucide-react";

const HomePage: React.FC = () => {
  // const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>({
    category: null,
    district: null,
    minPrice: null,
    maxPrice: null,
    minArea: null,
    maxArea: null,
    rooms: [],

    // Новые фильтры:
    minFloor: null, // Минимальный этаж
    maxFloor: null, // Максимальный этаж
    buildingType: [], // Тип дома: panel, brick, monolithic, etc.
    renovation: [], // Тип ремонта
    condition: [], // Состояние
    amenities: [], // Удобства (чекбоксы)
    hasPhoto: null, // Только с фото
    isExclusive: null, // Только эксклюзивы
    newBuilding: null, // Только новостройки
    minCeilingHeight: null, // Высота потолков
  });
  // const [viewMode, setViewMode] = useState<"list" | "map">("list"); // Новое состояние
  const [searchQuery, setSearchQuery] = useState("");

  // const handleEstateClick = (estate: Estate) => {
  //   navigate(`/estate/${estate.id}`);
  // };

  // Обновление одного фильтра
  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Сбросить все фильтры
  const resetFilters = () =>
    setFilters({
      category: null,
      district: null,
      minPrice: null,
      maxPrice: null,
      maxArea: null,
      minArea: null,
      rooms: [],

      // Новые фильтры:
      minFloor: null, // Минимальный этаж
      maxFloor: null, // Максимальный этаж
      buildingType: [], // Тип дома: panel, brick, monolithic, etc.
      renovation: [], // Тип ремонта
      condition: [], // Состояние
      amenities: [], // Удобства (чекбоксы)
      hasPhoto: null, // Только с фото
      isExclusive: null, // Только эксклюзивы
      newBuilding: null, // Только новостройки
      minCeilingHeight: null, // Высота потолков
    });

  // Фильтрация недвижимости
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
      matchesArea && // Добавляем проверку площади
      matchesRooms &&
      matchesFloor &&
      matchesRenovation &&
      matchesAmenities &&
      matchesHasPhoto &&
      matchesExclusive &&
      matchesNewBuilding
    );
  });

  // Получаем уникальные значения для фильтров
  const categories = Array.from(new Set(astanaEstates.map((e) => e.category)));
  const districts = Array.from(new Set(astanaEstates.map((e) => e.district)));
  const maxPrice = Math.max(...astanaEstates.map((e) => e.price));

  return (
    <main className="flex-1 p-4">
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
          minFloor: null, // Минимальный этаж
          maxFloor: null, // Максимальный этаж
          buildingType: [], // Тип дома: panel, brick, monolithic, etc.
          renovation: [], // Тип ремонта
          condition: [], // Состояние
          amenities: [], // Удобства (чекбоксы)
          hasPhoto: null, // Только с фото
          isExclusive: null, // Только эксклюзивы
          newBuilding: null, // Только новостройки
          minCeilingHeight: null, // Высота потолков
        }}
        filteredEstatesLength={filteredEstates.length}
      />

      {/* Статистика результатов */}
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
          {/* Контент в зависимости от режима просмотра */}
          {/* {viewMode === "list" ? ( */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEstates.map((estate) => (
              <EstateCard key={estate.id} {...estate} />
            ))}
          </div>
          {/* ) : (
            <MapView
              estates={filteredEstates}
              onEstateClick={handleEstateClick}
            />
          )} */}
        </>
      )}
      {/* <div className="fixed bottom-20 right-6 z-40">
        <button
          onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          {viewMode === "list" ? <Map size={24} /> : <List size={24} />}
        </button>
      </div> */}
    </main>
  );
};

export default HomePage;
