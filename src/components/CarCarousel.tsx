import React from "react";
import { useNavigate } from "react-router-dom";
import type { Car } from "../contants/cars";

interface CarCarouselProps {
  cars: Car[];
  title: string; // заголовок карусели
}

const CarCarousel: React.FC<CarCarouselProps> = ({ cars, title }) => {
  const navigate = useNavigate();

  if (cars.length === 0) return null; // если нет машин, не рендерим компонент

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
        {cars.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/car/${c.id}`)}
            className="flex-none w-[45%] border rounded p-2 shrink-0 cursor-pointer hover:shadow-md transition"
          >
            <img
              src={c.images[0]}
              alt={`${c.brand} ${c.model}`}
              className="w-full h-32 object-cover rounded"
            />
            <p className="text-sm font-medium mt-1">
              {c.brand} {c.model}
            </p>
            <p className="text-sm text-gray-600">{c.year}</p>
            <p className="text-sm font-bold text-blue-600">
              {c.price.toLocaleString()} ₸
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarCarousel;
