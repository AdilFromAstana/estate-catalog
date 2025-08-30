import type { FC } from "react";

interface FilterBarProps {
  onFilterChange: (filters: {
    price?: number;
    year?: number;
    mileage?: number;
  }) => void;
}

const FilterBar: FC<FilterBarProps> = ({ onFilterChange }) => {
  return (
    <div className="flex gap-2 p-3 bg-gray-100 rounded-lg shadow-sm">
      <input
        type="number"
        placeholder="Макс. цена"
        className="w-full p-2 border rounded-lg text-sm"
        onChange={(e) => onFilterChange({ price: Number(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Мин. год"
        className="w-full p-2 border rounded-lg text-sm"
        onChange={(e) => onFilterChange({ year: Number(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Макс. пробег"
        className="w-full p-2 border rounded-lg text-sm"
        onChange={(e) => onFilterChange({ mileage: Number(e.target.value) })}
      />
    </div>
  );
};

export default FilterBar;
