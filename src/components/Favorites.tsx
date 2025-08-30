import type { FC } from "react";
import CarCard from "./CarCard";
import type { Car } from "../contants/cars";

interface FavoritesProps {
  cars: Car[];
}

const Favorites: FC<FavoritesProps> = ({ cars }) => {
  if (cars.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-5">Избранных машин пока нет</p>
    );
  }

  return (
    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cars.map((car) => (
        <CarCard key={car.id} {...car} isFavorite />
      ))}
    </div>
  );
};

export default Favorites;
