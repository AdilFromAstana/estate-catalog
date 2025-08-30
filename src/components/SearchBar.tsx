import React, { useState, useMemo, useEffect } from "react";
import { Filter } from "lucide-react";
import { cars } from "../contants/cars";

interface Filters {
  brand: string | null;
  year: string | null;
  fuel: string | null;
  transmission: string | null;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string | null) => void;
  onResetFilters: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const [value, setValue] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSheet, setActiveSheet] = useState<keyof Filters | null>(null);

  // Собираем уникальные значения
  const filterOptions = useMemo(() => {
    const getUnique = (field: keyof (typeof cars)[0]) =>
      Array.from(new Set(cars.map((c) => c[field])));

    return {
      brand: getUnique("brand"),
      fuel: getUnique("fuel"),
      transmission: getUnique("transmission"),
      year: Array.from(new Set(cars.map((c) => String(c.year)))),
    };
  }, []);

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

  console.log("filters: ", filters);

  return (
    <>
      {/* Поиск + кнопка фильтров */}
      <div className="w-full max-w-md mx-auto mb-6 flex gap-2">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Поиск по марке или модели..."
          className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-1 px-3 py-2 border rounded-lg bg-gray-100 "
        >
          <Filter className="w-5 h-5" />
          <span>Фильтры</span>
        </button>
      </div>

      {/* Оверлей фильтров */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-51 flex">
          <div className="w-full md:w-96 bg-white h-full p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 leading-none"
                >
                  ✕
                </button>
                <h2 className="text-lg font-semibold leading-none">Фильтры</h2>
              </div>
              <button onClick={onResetFilters} className="py-2">
                Сбросить
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setActiveSheet("brand")}
                className="w-full flex justify-between border p-3 rounded-lg"
              >
                <span>Бренд</span>
                <span className="text-gray-400">
                  {filters.brand ?? "Выбрать"}
                </span>
              </button>
              <button
                onClick={() => setActiveSheet("fuel")}
                className="w-full flex justify-between border p-3 rounded-lg"
              >
                <span>Топливо</span>
                <span className="text-gray-400">
                  {filters.fuel ?? "Выбрать"}
                </span>
              </button>
              <button
                onClick={() => setActiveSheet("year")}
                className="w-full flex justify-between border p-3 rounded-lg"
              >
                <span>Год</span>
                <span className="text-gray-400">
                  {filters.year ?? "Выбрать"}
                </span>
              </button>
              <button
                onClick={() => setActiveSheet("transmission")}
                className="w-full flex justify-between border p-3 rounded-lg"
              >
                <span>КПП</span>
                <span className="text-gray-400">
                  {filters.transmission ?? "Выбрать"}
                </span>
              </button>
            </div>

            <button
              onClick={onResetFilters}
              className="mt-4 py-2 border rounded-lg"
            >
              Сбросить
            </button>

            <button
              onClick={() => setIsFilterOpen(false)}
              className="mt-auto bg-blue-600 text-white py-3 rounded-lg"
            >
              Применить
            </button>
          </div>
        </div>
      )}

      {/* Шторка выбора значений */}
      {activeSheet && (
        <div className="fixed inset-0 z-51 flex flex-col justify-end">
          {/* затемнённый фон */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setActiveSheet(null)}
          />

          {/* сама модалка */}
          <div className="relative bg-white rounded-t-2xl p-4 shadow-lg z-10">
            <h3 className="text-lg font-semibold mb-3">
              Выберите {activeSheet}
            </h3>

            <div className="space-y-2">
              {filterOptions[activeSheet].map((opt) => {
                const isSelected = filters[activeSheet] === opt; // выбран ли
                return (
                  <button
                    key={opt?.toString()}
                    className={`w-full border p-3 rounded-lg text-left  
                ${isSelected ? "bg-blue-500 text-white border-blue-500" : ""}`}
                    onClick={() => {
                      if (isSelected) {
                        onFilterChange(activeSheet, null); // снимаем выбор
                      } else {
                        onFilterChange(activeSheet, String(opt)); // выбираем
                      }
                      setActiveSheet(null);
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setActiveSheet(null)}
              className="mt-4 w-full py-2 bg-gray-200 rounded-lg"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
