import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cars } from "../contants/cars";
import CarCarousel from "../components/CarCarousel";
import ImageModal from "../components/ImageModal";
import CarLoanCalculator from "../components/CarLoanCalculator";
import CarContactButtons from "../components/CarContactButtons";

const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const car = cars.find((c) => c.id.toString() === id);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!car)
    return (
      <div className="p-4 text-red-500 font-bold">Автомобиль не найден</div>
    );

  const images = [...(car.images || [])];

  return (
    <div className="max-w-md mx-auto relative">
      <button
        onClick={() => {
          window.scrollTo({ top: 0 });
          navigate(-1);
        }}
        className="absolute top-4 left-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        <img
          key={images[0]}
          src={images[0]}
          className="w-full h-64 object-cover rounded-b-xl"
          onClick={() => {
            setCurrentImageIndex(0);
            setModalOpen(true);
          }}
        />
      </div>

      {modalOpen && (
        <ImageModal
          images={images}
          currentIndex={currentImageIndex}
          setCurrentIndex={setCurrentImageIndex}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div className="p-4">
        <CarContactButtons />
        <h1 className="text-xl font-bold">
          {car.brand} {car.model}, {car.year}
        </h1>
        <p className="text-2xl font-bold text-blue-600 mt-2">
          {car.price.toLocaleString()} ₸
        </p>

        <CarLoanCalculator price={car.price} />

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Характеристики</h2>
          <ul className="space-y-1 text-gray-700">
            <li>
              <strong>Пробег:</strong> {car.mileage.toLocaleString()} км
            </li>
            <li>
              <strong>Двигатель:</strong> {car.engine}
            </li>
            <li>
              <strong>Коробка:</strong> {car.transmission}
            </li>
            <li>
              <strong>Дата публикации:</strong> {car.date}
            </li>
            <li>
              <strong>Просмотры:</strong> {car.views}
            </li>
            <li>
              <strong>Лайки:</strong> {car.likes}
            </li>
          </ul>
        </div>

        <CarCarousel
          title={`Похожие модели ${car.brand} ${car.model}`}
          cars={cars.filter(
            (c) =>
              c.id !== car.id && c.brand === car.brand && c.model === car.model
          )}
        />
        <CarCarousel
          title={`Другие ${car.brand} по бренду`}
          cars={cars.filter(
            (c) =>
              c.id !== car.id && c.brand === car.brand && c.model !== car.model
          )}
        />
        <CarCarousel
          title={`Похожие по цене (±20%)`}
          cars={cars.filter(
            (c) =>
              c.id !== car.id &&
              Math.abs(c.price - car.price) <= car.price * 0.2
          )}
        />
      </div>
    </div>
  );
};

export default CarDetailsPage;
