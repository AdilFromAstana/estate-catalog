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
  fuel,
}) => {
  const downPaymentPercent = 0.1;
  const annualRate = 0.15;
  const months = 60;

  const downPayment = price * downPaymentPercent;
  const loanAmount = price - downPayment;

  const monthlyRate = annualRate / 12;

  const monthlyPayment =
    (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  return (
    <Link
      to={`/car/${id}`}
      className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4"
    >
      <div className="flex gap-4 flex-col">
        <div className="flex flex-col">
          <h3 className="font-semibold text-base text-gray-900">
            {brand} {model}, {year}
          </h3>
          <div className="flex justify-between">
            <p className="text-xl font-bold text-blue-600 mt-1">
              {price.toLocaleString()} ₸
            </p>
            <p className="text-sm text-black mt-1 bg-yellow-300 w-fit p-1 rounded-lg font-semibold">
              {Number(monthlyPayment.toFixed(0)).toLocaleString()} ₸ x {months}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <img
            src={images[0]}
            alt={`${brand} ${model}`}
            className="w-1/2 aspect-[12/8] object-cover rounded-xl border"
          />
          <p className="text-sm text-gray-600 mt-1">
            {engine} • {transmission} • {year} • {fuel} •{" "}
            {mileage.toLocaleString()} км
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CarCard;
