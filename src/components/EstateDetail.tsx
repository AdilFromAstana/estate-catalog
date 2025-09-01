import type { FC } from "react";

interface EstateDetailProps {
  title: string;
  price: number;
  year: number;
  mileage: number;
  description: string;
  image: string;
}

const EstateDetail: FC<EstateDetailProps> = ({
  title,
  price,
  year,
  mileage,
  description,
  image,
}) => {
  return (
    <div className="p-4">
      <img src={image} alt={title} className="w-full rounded-xl mb-4" />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-1">Цена: {price.toLocaleString()} ₸</p>
      <p className="text-gray-600 mb-1">Год: {year}</p>
      <p className="text-gray-600 mb-1">
        Пробег: {mileage.toLocaleString()} км
      </p>
      <p className="text-sm text-gray-500 mt-3">{description}</p>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
        Связаться с салоном
      </button>
    </div>
  );
};

export default EstateDetail;
