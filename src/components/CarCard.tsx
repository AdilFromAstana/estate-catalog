import React from "react";
import type { Car } from "../contants/cars";
import { Link } from "react-router-dom";

const CarCard: React.FC<Car> = ({
  id,
  brand,
  model,
  year,
  price,
  mileage,
  engine,
  transmission,
  images,
  isFavorite,
  views,
  likes,
  date,
}) => {
  return (
    <Link
      to={`/car/${id}`}
      className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4"
    >
      {/* верх: фото + инфо */}
      <div className="flex gap-4">
        <img
          src={images[0]}
          alt={`${brand} ${model}`}
          className="w-40 h-28 object-cover rounded-xl border"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-base text-gray-900">
              {brand} {model}, {year}
            </h3>
            <p className="text-xl font-bold text-blue-600 mt-1">
              {price.toLocaleString()} ₸
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {engine} • {transmission} • {mileage.toLocaleString()} км
            </p>
          </div>
        </div>
        {/* избранное */}
        <button className="text-xl hover:scale-110 transition-transform">
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      {/* нижняя строка */}
      <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-2 border-t">
        <span>{date}</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            👁 <span>{views}</span>
          </span>
          <span className="flex items-center gap-1">
            ❤ <span>{likes}</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
