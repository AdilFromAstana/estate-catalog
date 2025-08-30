import React, { useState } from "react";
import SearchBar from "./SearchBar";
import { FilterModal } from "./FilterModal";

export interface Filters {
  brand?: string; // марка машины
  model?: string; // модель
  fuel?: string; // бензин / дизель / электрика
  year?: string; // год выпуска
  transmission?: string;
}

const SearchAndFilters: React.FC = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [isFiltersOpen, setFiltersOpen] = useState(false);

  const handleApplyFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-3">
      <div className="flex gap-2">
        <SearchBar onSearch={setQuery} />
        <button
          onClick={() => setFiltersOpen(true)}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg"
        >
          Фильтры
        </button>
      </div>

      {isFiltersOpen && (
        <FilterModal
          filters={filters}
          onApply={handleApplyFilter}
          onClose={() => setFiltersOpen(false)}
        />
      )}

      <div className="mt-4 text-sm text-gray-700">
        <p>Поиск: {query || "—"}</p>
        <p>Бренд: {filters.brand || "—"}</p>
        <p>Топливо: {filters.fuel || "—"}</p>
        <p>КПП: {filters.transmission || "—"}</p>
      </div>
    </div>
  );
};

export default SearchAndFilters;
