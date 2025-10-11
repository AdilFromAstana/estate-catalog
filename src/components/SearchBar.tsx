import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import type { City, District } from "../api/cityApi";
import type { GetPropertiesParams } from "../api/propertyApi";
import {
  MapPin,
  Ruler,
  Building,
  DollarSign,
  Bed,
  XCircle,
} from "lucide-react";

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
}> = ({ filterOptions, onFilterChange, onResetFilters, filters }) => {
  return (
    <div className="space-y-6 flex-1 overflow-y-auto hide-scrollbar">
      {/* Заголовок */}
      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
          Фильтры поиска
        </h3>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-sm flex items-center text-gray-500 hover:text-red-600 transition"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Сбросить
        </button>
      </div>

      {/* Города */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
          Город
        </label>
        <select
          value={filters.cityId || ""}
          onChange={(e) =>
            onFilterChange(
              "cityId",
              e.target.value ? Number(e.target.value) : null
            )
          }
          className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Все города</option>
          {filterOptions.cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Район */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
          Район
        </label>
        <select
          value={filters.districtId || ""}
          onChange={(e) =>
            onFilterChange(
              "districtId",
              e.target.value ? Number(e.target.value) : null
            )
          }
          className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <DollarSign className="w-4 h-4 mr-2 text-indigo-500" />
          Цена (₸)
        </label>
        <PriceFilter
          filters={filters}
          onFilterChange={onFilterChange}
          filterOptions={filterOptions}
        />
      </div>

      {/* Площадь */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Ruler className="w-4 h-4 mr-2 text-indigo-500" />
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
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Этаж */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Building className="w-4 h-4 mr-2 text-indigo-500" />
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
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Комнаты */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Bed className="w-4 h-4 mr-2 text-indigo-500" />
          Количество комнат
        </label>
        <div className="flex flex-wrap gap-2">
          {filterOptions.rooms.map((room) => (
            <button
              key={room}
              type="button"
              onClick={() =>
                filters.rooms === room
                  ? onFilterChange("rooms", null)
                  : onFilterChange("rooms", room)
              }
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filters.rooms === room
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-400/40"
                  : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
              }`}
            >
              {room === 4 ? "4+" : room}
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
