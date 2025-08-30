import React from "react";

interface FilterSidebarProps {
  brands: string[];
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  brands,
  selectedBrand,
  onSelectBrand,
}) => {
  return (
    <aside className="w-64 border-r p-4">
      <h2 className="text-xl font-semibold mb-4">Фильтры</h2>
      <div className="space-y-2">
        <button
          className={`block w-full text-left px-3 py-2 rounded-md ${
            selectedBrand === null
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
          onClick={() => onSelectBrand(null)}
        >
          Все бренды
        </button>
        {brands.map((brand) => (
          <button
            key={brand}
            className={`block w-full text-left px-3 py-2 rounded-md ${
              selectedBrand === brand
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => onSelectBrand(brand)}
          >
            {brand}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default FilterSidebar;
