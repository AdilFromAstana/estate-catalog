import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cars } from "../contants/cars";
import CarCarousel from "../components/CarCarousel";
import ImageModal from "../components/ImageModal";

const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const car = cars.find((c) => c.id.toString() === id);
  const navigate = useNavigate();

  if (!car) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-red-500">Автомобиль не найден</h1>
      </div>
    );
  }

  // Расчёт кредита
  const price = car.price;

  // ограничим взнос: минимум 10%, максимум 80%
  const minPayment = Math.round(price * 0.1);
  const maxPayment = Math.round(price * 0.8);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [...(car.images || [])];

  // Стейты для кредита
  const [initialPayment, setInitialPayment] = useState(minPayment); // ₸
  const [term, setTerm] = useState(36); // срок кредитования (мес)
  const [rate] = useState(15); // годовая ставка %

  const validInitialPayment = Math.min(
    Math.max(initialPayment, minPayment),
    maxPayment
  );

  const loanAmount = price - validInitialPayment;
  const monthlyRate = rate / 100 / 12;
  const monthlyPayment =
    (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setInitialPayment(minPayment);
  }, [id]);

  return (
    <div className="max-w-md mx-auto relative">
      <button
        onClick={() => {
          window.scrollTo({ top: 0 });
          navigate(-1);
        }}
        className="absolute top-4 left-4 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
      >
        {/* Простая стрелка влево */}
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
      {/* Фото */}
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

      {/* Основная инфа */}
      <div className="p-4">
        <div className="mb-2 flex gap-2">
          {/* Кнопка Позвонить */}
          <a
            href="tel:+77761156416"
            className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center transition"
          >
            Позвонить
          </a>

          {/* Кнопка WhatsApp */}
          <a
            href="https://wa.me/77761156416"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-[#25D366] text-white rounded-lg hover:bg-green-500 text-center transition"
          >
            WhatsApp
          </a>
        </div>

        <h1 className="text-xl font-bold">
          {car.brand} {car.model}, {car.year}
        </h1>
        <p className="text-2xl font-bold text-blue-600 mt-2">
          {price.toLocaleString()} ₸
        </p>
        {/* Кредитный калькулятор */}
        <div className="mt-6 p-4 border rounded-xl shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-3">Купить в кредит</h2>

          {/* Первоначальный взнос */}
          <label className="block text-sm font-medium mb-1">
            Стоимость авто (₸)
          </label>
          <input
            value={car.price.toLocaleString()}
            readOnly
            className="w-full border rounded p-2 mb-2"
          />

          <label className="block text-sm font-medium mb-1">
            Первоначальный взнос (₸)
          </label>
          <input
            type="number"
            value={minPayment}
            onChange={(e) => setInitialPayment(Number(e.target.value))}
            className="w-full border rounded p-2 mb-2"
          />

          <p className="text-sm mb-3 text-gray-600">
            Минимум {minPayment.toLocaleString()} ₸
          </p>

          {/* Срок */}
          <label className="block text-sm font-medium mb-2">Срок (мес.)</label>
          <div className="flex justify-between gap-2 mb-3">
            {[12, 24, 36, 48, 60].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTerm(option)}
                className={`px-4 py-2 rounded-lg border transition w-full ${
                  term === option
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Итог */}
          <div className="bg-gray-100 rounded-lg p-3">
            {initialPayment >= minPayment && initialPayment <= maxPayment ? (
              <>
                <p>
                  <strong>Сумма кредита:</strong> {loanAmount.toLocaleString()}{" "}
                  ₸
                </p>
                <p>
                  <strong>Месячный платёж:</strong>{" "}
                  {monthlyPayment
                    ? Number(monthlyPayment.toFixed(0)).toLocaleString()
                    : 0}{" "}
                  ₸
                </p>
              </>
            ) : (
              <p className="text-red-500">
                Введите первоначальный взнос в диапазоне{" "}
                {minPayment.toLocaleString()} ₸ – {maxPayment.toLocaleString()}{" "}
                ₸
              </p>
            )}
          </div>

          <div className="mt-4 flex">
            <a
              className="py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex-1 text-center"
              href="tel:+77761156416"
              target="_blank"
              rel="noopener noreferrer"
            >
              Узнать решение по кредиту
            </a>
          </div>
        </div>
        {/* Характеристики */}
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
