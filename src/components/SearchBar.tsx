import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import type { City, District } from "../api/cityApi";
import type { GetPropertiesParams } from "../api/propertyApi";

const formatNumber = (value: string | number) => {
  if (!value) return "";
  const num = parseInt(value.toString().replace(/\D/g, ""), 10);
  if (isNaN(num)) return "";
  return num.toLocaleString("ru-RU"); // разделяет по тысячам (1 000 000)
};

const PriceFilter = ({ filters, onFilterChange, filterOptions }: any) => {
  const [minDisplay, setMinDisplay] = useState(
    filters.minPrice?.toString() || ""
  );
  const [maxDisplay, setMaxDisplay] = useState(
    filters.maxPrice?.toString() || ""
  );

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, ""); // убираем пробелы
    setMinDisplay(formatNumber(raw));
    const numeric = parseInt(raw.replace(/\D/g, ""), 10);
    onFilterChange("minPrice", isNaN(numeric) ? null : numeric);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, "");
    setMaxDisplay(formatNumber(raw));
    const numeric = parseInt(raw.replace(/\D/g, ""), 10);
    onFilterChange("maxPrice", isNaN(numeric) ? null : numeric);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Цена, ₸
      </label>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          inputMode="numeric"
          placeholder="От"
          value={minDisplay}
          onChange={handleMinChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="text"
          inputMode="numeric"
          placeholder="До"
          value={maxDisplay}
          onChange={handleMaxChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0 ₸</span>
        <span>{formatNumber(filterOptions.maxPrice)} ₸</span>
      </div>
    </div>
  );
};

export const FilterContent: React.FC<{
  filters: GetPropertiesParams;
  onFilterChange: (key: keyof GetPropertiesParams, value: any) => void;
  onResetFilters: () => void;
  filterOptions: {
    cities: City[];
    districts: District[];
    maxPrice: number;
    rooms: number[];
    minFloor: number | null;
    maxFloor: number | null;
  };
}> = ({ filterOptions, onFilterChange, filters }) => {
  return (
    <div className="space-y-4 flex-1 overflow-y-scroll hide-scrollbar">
      {/* Города */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Города
        </label>
        <select
          value={filters.cityId || ""}
          onChange={(e) => onFilterChange("cityId", e.target.value || null)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Все города</option>
          {filterOptions.cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

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
      <PriceFilter
        filters={filters}
        onFilterChange={onFilterChange}
        filterOptions={filterOptions}
      />

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

      {/* Комнаты */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Количество комнат
        </label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((room) => (
            <button
              key={room}
              type="button"
              onClick={() => {
                // если уже выбрана та же комната → очищаем фильтр
                if (filters.rooms === room) {
                  onFilterChange("rooms", null);
                } else {
                  onFilterChange("rooms", room);
                }
              }}
              className={`px-3 cursor-pointer py-2 rounded-lg border transition-colors text-sm font-medium ${
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
    districts: District[];
    maxPrice: number;
    rooms: number[];
    minFloor: number | null;
    maxFloor: number | null;
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
