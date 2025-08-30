import React, { useState } from "react";
import CarCard from "../components/CarCard";
import SearchBar from "../components/SearchBar";
import { cars } from "../contants/cars";

interface Filters {
  brand: string | null;
  fuel: string | null;
  year: string | null;
  transmission: string | null;
}

const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    brand: null,
    year: null,
    fuel: null,
    transmission: null,
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Обновление одного фильтра
  const updateFilter = (key: keyof Filters, value: string | null) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Сбросить все фильтры
  const resetFilters = () =>
    setFilters({
      brand: null,
      year: null,
      fuel: null,
      transmission: null,
    });

  // Фильтрация машин
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand = filters.brand ? car.brand === filters.brand : true;
    const matchesFuel = filters.fuel ? car.fuel === filters.fuel : true;
    const matchesYear = filters.year ? String(car.year) === filters.year : true;
    const matchesTransmission = filters.transmission
      ? car.transmission === filters.transmission
      : true;

    return (
      matchesSearch &&
      matchesBrand &&
      matchesFuel &&
      matchesYear &&
      matchesTransmission
    );
  });

  return (
    <main className="flex-1 p-2">
      <SearchBar
        onSearch={setSearchQuery}
        filters={filters}
        onFilterChange={updateFilter}
        onResetFilters={resetFilters}
      />

      {filteredCars.length === 0 ? (
        <p className="text-gray-600">Ничего не найдено.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCars.map((car) => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      )}
    </main>
  );
};

export default HomePage;
