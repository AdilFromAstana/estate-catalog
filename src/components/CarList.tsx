import type { FC } from "react";
import CarCard from "./CarCard";

interface Car {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  images: string;
  isFavorite?: boolean;
}

interface CarListProps {
  cars: Car[];
}

const CarList: FC<CarListProps> = ({ cars }) => {
  if (cars.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-5">Нет доступных машин</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3">
      {cars.map((car) => (
        <CarCard key={car.id} {...car} />
      ))}
    </div>
  );
};

export default CarList;
