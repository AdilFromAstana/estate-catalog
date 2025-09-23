import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Edit3 } from "lucide-react";
import { useApp } from "../AppContext";

// Определяем тип для данных, получаемых от вашего NestJS API парсера
// Поля соответствуют тому, что возвращает метод parsePage в PropertiesService
interface ParsedPropertyData {
  title: string;
  price: string; // Приходит как строка
  currency: string;
  address: string; // Оригинальный адрес из .offer__location
  city: string;
  district: string;
  street: string;
  houseNumber: string;
  area: string; // Общая площадь, как строка
  kitchenArea: string; // Площадь кухни, как строка
  rooms: string; // Количество комнат, как строка
  floorInfo: string; // Полная строка этажности, например, "11 из 16"
  floor: string; // Этаж, как строка
  totalFloors: string; // Всего этажей, как строка
  buildingType: string;
  yearBuilt: string;
  condition: string;
  bathroom: string;
  balcony: string;
  parking: string;
  furniture: string;
  complex: string;
  description: string;
  images: string[]; // Массив URL строк
  sourceUrl: string;
  coordinates: string; // Координаты как строка "lat,lng" или пустая строка
  // Добавьте другие поля, если они будут добавлены в ответ API
}

const AddPropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const { addProperty, user } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [parsedData, setParsedData] = useState<ParsedPropertyData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [mode, setMode] = useState<"manual" | "import">("manual");

  // Состояние формы, инициализируем поля
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "", // city, district - для ручного режима
    area: "",
    bedrooms: "", // rooms
    bathrooms: "", // bathroom
    type: "apartment" as const,
    status: "sale" as const,
    images: [] as string[],
    // Поля для импорта
    city: "",
    district: "",
    street: "",
    houseNumber: "",
    floor: "",
    totalFloors: "",
    condition: "",
    buildingType: "",
    yearBuilt: "",
    balcony: "",
    parking: "",
    furniture: "",
    complex: "",
    kitchenArea: "",
    coordinates: { lat: 0, lng: 0 }, // Преобразуем из строки coordinates
    realtorId: user?.id || "",
  });

  // Функция для вызова API парсинга
  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl) {
      setImportError("Пожалуйста, введите URL объявления Krisha.kz");
      return;
    }

    setIsImporting(true);
    setImportError(null);
    setParsedData(null);

    try {
      // TODO: Замените на ваш реальный адрес API
      const response = await fetch(
        "http://localhost:3000/properties/parse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${yourAuthToken}`, // Если нужна авторизация
          },
          body: JSON.stringify({ url: importUrl }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка импорта: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data: ParsedPropertyData = await response.json();
      console.log("Импортированные данные:", data);
      setParsedData(data);

      // Преобразуем координаты из строки "lat,lng"
      let coords = { lat: 0, lng: 0 };
      if (data.coordinates) {
        const [latStr, lngStr] = data.coordinates
          .split(",")
          .map((s) => s.trim());
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (!isNaN(lat) && !isNaN(lng)) {
          coords = { lat, lng };
        }
      }

      // Заполняем форму данными из парсера
      // Приоритет отдаём импортированным данным, особенно для адреса
      setFormData({
        title: data.title || "",
        description: data.description || "",
        price: data.price || "", // Оставляем как строку
        // Для ручного режима location не используется, но заполним на всякий
        location:
          data.city || data.district ? `${data.city}, ${data.district}` : "",
        area: data.area || "",
        bedrooms: data.rooms || "", // rooms -> bedrooms
        bathrooms: data.bathroom || "",
        type: "apartment", // Можно попытаться определить, или оставить по умолчанию
        status: "sale", // По умолчанию
        images: data.images || [],
        // Поля из импорта
        city: data.city || "",
        district: data.district || "",
        street: data.street || "",
        houseNumber: data.houseNumber || "",
        floor: data.floor || "", // Уже строка
        totalFloors: data.totalFloors || "", // Уже строка
        condition: data.condition || "",
        buildingType: data.buildingType || "",
        yearBuilt: data.yearBuilt || "",
        balcony: data.balcony || "",
        parking: data.parking || "",
        furniture: data.furniture || "",
        complex: data.complex || "",
        kitchenArea: data.kitchenArea || "",
        coordinates: coords,
        realtorId: user?.id || "",
      });
    } catch (error: any) {
      console.error("Ошибка импорта:", error);
      setImportError(error.message || "Произошла ошибка при импорте данных.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Здесь можно добавить валидацию данных формы перед отправкой
      addProperty({
        // title: formData.title, // Если нужно, добавьте в addProperty
        description: formData.description,
        price: Number(formData.price) || 0,
        status: "hidden", // Используем статус из формы
        images: formData.images,
        category: formData.type,
        city: formData.city || formData.location.split(",")[0]?.trim() || "", // Приоритет импортированному city
        district:
          formData.district || formData.location.split(",")[1]?.trim() || "",
        street: formData.street || "",
        houseNumber: formData.houseNumber || "",
        coordinates: formData.coordinates,
        currency: "KZT", // Предполагаем KZT, можно сделать поле ввода
        totalArea: Number(formData.area) || 0,
        roomCount: Number(formData.bedrooms) || 0,
        floor: Number(formData.floor) || 0,
        totalFloors: Number(formData.totalFloors) || 0,
        amenities: [], // Можно расширить, если будут данные из парсера
        agent: {
          id: user?.id || "",
          name: user?.name || "",
          avatar: undefined,
          phone: "",
        },
        agency: {
          id: "",
          name: "",
          logo: "",
          phone: "",
        },
        isExclusive: false,
        views: 0,
        priority: 0,
        condition: "excellent",
        // Добавьте другие поля, если они требуются addProperty
      });

      navigate("/my-properties");
    } catch (error) {
      console.error("Error adding property:", error);
      // TODO: Показать пользователю сообщение об ошибке
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetImport = () => {
    setParsedData(null);
    setImportUrl("");
    setImportError(null);
    // Сбросить форму к пустым значениям или к дефолтным
    setFormData({
      title: "",
      description: "",
      price: "",
      location: "",
      area: "",
      bedrooms: "",
      bathrooms: "",
      type: "apartment",
      status: "sale",
      images: [],
      city: "",
      district: "",
      street: "",
      houseNumber: "",
      floor: "",
      totalFloors: "",
      condition: "",
      buildingType: "",
      yearBuilt: "",
      balcony: "",
      parking: "",
      furniture: "",
      complex: "",
      kitchenArea: "",
      coordinates: { lat: 0, lng: 0 },
      realtorId: user?.id || "",
    });
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Добавить объект недвижимости</h1>
        </div>

        {/* Переключатель режима */}
        <div className="mb-6 flex border-b">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              mode === "manual"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setMode("manual")}
          >
            <Edit3 size={16} className="inline mr-1" />
            Вручную
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              mode === "import"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setMode("import")}
          >
            <Download size={16} className="inline mr-1" />
            Импорт с Krisha.kz
          </button>
        </div>

        {/* Форма импорта */}
        {mode === "import" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Импорт данных с Krisha.kz
            </h2>
            <form onSubmit={handleImport} className="space-y-4">
              <div>
                <label
                  htmlFor="importUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  URL объявления на Krisha.kz *
                </label>
                <input
                  type="url"
                  id="importUrl"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  required
                  placeholder="https://krisha.kz/a/show/..."
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isImporting}
                />
              </div>
              {importError && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                  Ошибка: {importError}
                </div>
              )}
              {parsedData && (
                <div className="text-green-600 text-sm p-2 bg-green-50 rounded">
                  Данные успешно импортированы! Вы можете их отредактировать
                  ниже перед добавлением.
                  <button
                    type="button"
                    onClick={handleResetImport}
                    className="ml-2 text-blue-500 hover:underline text-xs"
                  >
                    Сбросить импорт
                  </button>
                </div>
              )}
              <button
                type="submit"
                disabled={isImporting}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                {isImporting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Импорт...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-1" />
                    Импортировать данные
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Основная форма добавления */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            {mode === "import"
              ? "Отредактируйте данные"
              : "Введите данные вручную"}
          </h2>

          {/* Поля формы */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название объекта *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Например: Квартира в центре Астаны"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена (₸) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50000000"
              />
            </div>

            {/* Адрес - разбиваем на составляющие для импорта, или один инпут для ручного */}
            {mode === "import" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Город *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Астана"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Район
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Есильский район"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Улица
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Улица"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Номер дома
                  </label>
                  <input
                    type="text"
                    name="houseNumber"
                    value={formData.houseNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5/1"
                  />
                </div>
              </>
            ) : (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Местоположение *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Астана, Есильский район"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Площадь (м²) *
              </label>
              <input
                type="number"
                step="0.01"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="85"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Спальни *
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ванные комнаты *
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2"
              />
            </div>

            {/* Дополнительные поля из импорта */}
            {mode === "import" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Этаж
                  </label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Всего этажей
                  </label>
                  <input
                    type="number"
                    name="totalFloors"
                    value={formData.totalFloors}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="16"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Состояние
                  </label>
                  <input
                    type="text"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="не новый, но аккуратный ремонт"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип здания
                  </label>
                  <input
                    type="text"
                    name="buildingType"
                    value={formData.buildingType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="монолитный"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Площадь кухни (м²)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="kitchenArea"
                    value={formData.kitchenArea}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10.3"
                  />
                </div>
                {/* Можно добавить больше полей из импорта по необходимости */}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип недвижимости *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="apartment">Квартира</option>
                <option value="house">Дом</option>
                <option value="commercial">Коммерческая</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sale">Продажа</option>
                <option value="rent">Аренда</option>
                <option value="hidden">Скрыт</option>{" "}
                {/* Если это допустимый статус */}
                {/* Добавьте другие статусы, если они есть в addProperty */}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Например: Просторная 3-комнатная квартира с видом на Байтерек..."
            />
          </div>

          {/* Отображение импортированных изображений */}
          {mode === "import" && formData.images.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Импортированные изображения ({formData.images.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.images.slice(0, 5).map(
                  (
                    imgUrl,
                    index // Показываем первые 5
                  ) => (
                    <div
                      key={index}
                      className="w-20 h-20 border rounded overflow-hidden"
                    >
                      <img
                        src={imgUrl}
                        alt={`Импорт ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/80?text=Ошибка";
                        }} // Заглушка при ошибке
                      />
                    </div>
                  )
                )}
                {formData.images.length > 5 && (
                  <div className="w-20 h-20 border rounded flex items-center justify-center text-xs text-gray-500">
                    +{formData.images.length - 5} ещё
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Добавление...
                </>
              ) : (
                "Добавить объект"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyPage;
