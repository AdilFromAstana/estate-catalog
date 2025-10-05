import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import type { City, District } from "../api/cityApi";
import type { GetPropertiesParams } from "../api/propertyApi";

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} млн ₸`;
  }
  return `${(price / 1000).toFixed(0)} тыс ₸`;
};

const FilterContent: React.FC<{
  filters: GetPropertiesParams;
  onFilterChange: (key: keyof GetPropertiesParams, value: any) => void;
  onResetFilters: () => void;
  filterOptions: {
    cities: City[];
    categories: string[];
    districts: District[];
    maxPrice: number;
    rooms: number[];
    minFloor: number | null;
    maxFloor: number | null;
    buildingType: string[];
    condition: string[];
    amenities: string[];
    hasPhoto: boolean | null;
    minCeilingHeight: number | null;
  };
}> = ({ filterOptions, onFilterChange, filters }) => {
  return (
    <div className="space-y-4 flex-1 overflow-y-scroll hide-scrollbar">
      {/* Район */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Район
        </label>
        <select
          value={filters.districtId || ""}
          onChange={(e) => onFilterChange("districtId", e.target.value || null)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Все районы</option>
          {filterOptions.districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* Цена */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Цена, ₸
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="От"
            value={filters.minPrice || ""}
            onChange={(e) =>
              onFilterChange(
                "minPrice",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="До"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              onFilterChange(
                "maxPrice",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 ₸</span>
          <span>{formatPrice(filterOptions.maxPrice)}</span>
        </div>
      </div>

      {/* Площадь, м² */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Площадь, м²
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="От"
            value={filters.minArea || ""}
            onChange={(e) =>
              onFilterChange(
                "minArea",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="До"
            value={filters.maxArea || ""}
            onChange={(e) =>
              onFilterChange(
                "maxArea",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 м²</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Этаж
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="От"
            min="1"
            value={filters.minFloor || ""}
            onChange={(e) =>
              onFilterChange(
                "minFloor",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="До"
            min="1"
            value={filters.maxFloor || ""}
            onChange={(e) =>
              onFilterChange(
                "maxFloor",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Тип дома
        </label>
        <div className="grid grid-cols-2 gap-2">
          {["panel", "brick", "monolithic", "stalin"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                const current = filters.buildingType || [];
                onFilterChange(
                  "buildingType",
                  current.includes(type)
                    ? current.filter((t) => t !== type)
                    : [...current, type]
                );
              }}
              className={`p-2 text-sm rounded-lg border transition-colors ${
                filters.buildingType?.includes(type)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {type === "panel" && "Панельный"}
              {type === "brick" && "Кирпичный"}
              {type === "monolithic" && "Монолитный"}
              {type === "stalin" && "Сталинский"}
            </button>
          ))}
        </div>
      </div> */}

      {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ремонт
                </label>
                <select
                  value={filters.renovation?.[0] || ""}
                  onChange={(e) =>
                    onFilterChange(
                      "renovation",
                      e.target.value ? [e.target.value] : []
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Любой ремонт</option>
                  <option value="euro">Евроремонт</option>
                  <option value="designer">Дизайнерский</option>
                  <option value="cosmetic">Косметический</option>
                  <option value="without">Без ремонта</option>
                </select>
              </div> */}

      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Удобства
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {Array.from(
            new Set(astanaEstates.flatMap((estate) => estate.amenities))
          ).map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.amenities?.includes(amenity) || false}
                onChange={(e) => {
                  const current = filters.amenities || [];
                  onFilterChange(
                    "amenities",
                    e.target.checked
                      ? [...current, amenity]
                      : current.filter((a) => a !== amenity)
                  );
                }}
                className="rounded border-gray-300"
              />
              <span className="whitespace-break-spaces">{amenity}</span>
            </label>
          ))}
        </div>
      </div> */}

      {/* <div className="grid grid-cols-1 gap-3">
         <label className="flex items-center gap-2 text-md border-t-2 border-gray-300 pt-2">
                  <input
                    type="checkbox"
                    checked={filters.newBuilding || false}
                    onChange={(e) =>
                      onFilterChange("newBuilding", e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <span>Новостройка</span>
                </label>
      </div> */}

      {/* Комнаты */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Количество комнат
        </label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((room) => (
            <button
              key={room}
              type="button"
              onClick={() => {
                // const currentRooms = filters?.rooms || [];
                // if (currentRooms.includes(room)) {
                //   // Убираем комнату если уже выбрана
                //   onFilterChange(
                //     "rooms",
                //     currentRooms.filter((r) => r !== room)
                //   );
                // } else {
                // Добавляем комнату
                onFilterChange("rooms", room);
                // }
              }}
              className={`px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
                filters.rooms === room
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
              }`}
            >
              {room === 6 ? "6+" : room}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface SearchBarProps {
  onSearch: (query: string) => void;
  filters: GetPropertiesParams;
  onFilterChange: (key: keyof GetPropertiesParams, value: any) => void;
  onResetFilters: () => void;
  filterOptions: {
    cities: City[];
    categories: string[];
    districts: District[];
    maxPrice: number;
    rooms: number[];
    minFloor: number | null;
    maxFloor: number | null;
    buildingType: string[];
    condition: string[];
    amenities: string[];
    hasPhoto: boolean | null;
    minCeilingHeight: number | null;
  };
  filteredEstatesLength: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  filters,
  onFilterChange,
  onResetFilters,
  filterOptions,
  filteredEstatesLength,
}) => {
  const [value, setValue] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSheet] = useState<keyof GetPropertiesParams | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  useEffect(() => {
    if (isFilterOpen || activeSheet) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen, activeSheet]);

  return (
    <>
      {/* Поиск + кнопка фильтров */}
      <div className="w-full max-w-2xl mx-auto mb-4 flex gap-3">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Поиск по району, улице или микрорайону..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="hidden sm:block">Фильтры</span>
        </button>
      </div>

      {/* Оверлей фильтров */}
      {isFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-75 z-40"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className="w-full h-full bg-white p-6 flex flex-col overflow-y-auto md:hidden">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <h2 className="text-xl font-semibold">Фильтры</h2>
                <button
                  onClick={onResetFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Сбросить всё
                </button>
              </div>
              <FilterContent
                onResetFilters={onResetFilters}
                filters={filters}
                onFilterChange={onFilterChange}
                filterOptions={filterOptions}
              />

              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors my-4"
              >
                Показать результаты ({filteredEstatesLength})
              </button>
            </div>

            {/* Десктоп: по центру */}
            <div className="hidden md:flex w-full max-w-lg h-[80vh] bg-white p-6 flex-col rounded-xl shadow-lg overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <h2 className="text-xl font-semibold">Фильтры</h2>
                <button
                  onClick={onResetFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Сбросить всё
                </button>
              </div>
              <FilterContent
                onResetFilters={onResetFilters}
                filters={filters}
                onFilterChange={onFilterChange}
                filterOptions={filterOptions}
              />
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors my-4"
              >
                Показать результаты ({filteredEstatesLength})
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchBar;
