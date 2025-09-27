import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Edit3 } from "lucide-react";
import { useApp } from "../AppContext";
import toast from "react-hot-toast";
import { propertyApi } from "../api/propertyApi";
import { cityApi, type City, type District } from "../api/cityApi";

interface FormData {
  title: string;
  description: string;
  price: string;
  location: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  type: "apartment" | "house" | "commercial";
  status: "sale" | "rent" | "hidden";
  images: string[];
  city: string;
  cityId: number | null;
  district: string;
  districtId: number | null;
  street: string;
  houseNumber: string;
  floor: string;
  totalFloors: string;
  condition: string;
  buildingType: string;
  yearBuilt: string;
  balcony: string;
  parking: string;
  furniture: string;
  complex: string;
  kitchenArea: string;
  coordinates: { lat: number; lng: number };
  realtorId: string;
}
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
  const { user } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [parsedData, setParsedData] = useState<ParsedPropertyData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [mode, setMode] = useState<"manual" | "import">("manual");
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await cityApi.getAllCities();
        setCities(data);
      } catch (err) {
        console.error("Ошибка загрузки городов:", err);
        toast.error("Не удалось загрузить города. Попробуйте позже.");
      }
    };
    loadCities();
  }, []);

  useEffect(() => {
    if (selectedCityId) {
      const loadDistricts = async () => {
        try {
          const data = await cityApi.getDistrictsByCity(selectedCityId);
          setDistricts(data);
        } catch (err) {
          console.error("Ошибка загрузки районов:", err);
          toast.error("Не удалось загрузить районы этого города.");
        }
      };
      loadDistricts();
    } else {
      setDistricts([]);
    }
  }, [selectedCityId]);

  // Состояние формы, инициализируем поля
  const [formData, setFormData] = useState<FormData>({
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
    cityId: null,
    district: "",
    districtId: null,
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
      const response = await fetch("http://localhost:3000/properties/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Ошибка импорта: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data: ParsedPropertyData = await response.json();
      setParsedData(data);

      // Преобразуем координаты
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

      // === НОВОЕ: Автоматический выбор города и района ===
      let foundCityId: number | null = null;
      let foundDistrictId: number | null = null;

      // 1. Ищем город по названию
      if (data.city) {
        const cityMatch = cities.find(
          (c) =>
            c.name.toLowerCase().includes(data.city.toLowerCase()) ||
            data.city.toLowerCase().includes(c.name.toLowerCase())
        );
        if (cityMatch) {
          foundCityId = cityMatch.id;
          // Загружаем районы этого города
          const districtList = await cityApi.getDistrictsByCity(foundCityId);
          setDistricts(districtList);

          // 2. Ищем район по названию
          if (data.district && districtList.length > 0) {
            const districtMatch = districtList.find(
              (d) =>
                d.name.toLowerCase().includes(data.district.toLowerCase()) ||
                data.district.toLowerCase().includes(d.name.toLowerCase())
            );
            if (districtMatch) {
              foundDistrictId = districtMatch.id;
            }
          }
        }
      }

      // Заполняем форму
      const newFormData = {
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        location:
          data.city || data.district ? `${data.city}, ${data.district}` : "",
        area: data.area || "",
        bedrooms: data.rooms || "",
        bathrooms: data.bathroom || "",
        type: "apartment" as const,
        status: "sale" as const,
        images: data.images || [],
        city: data.city || "",
        district: data.district || "",
        street: data.street || "",
        houseNumber: data.houseNumber || "",
        floor: data.floor || "",
        totalFloors: data.totalFloors || "",
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
        // Устанавливаем ID сразу
        cityId: foundCityId, // ← добавлено
        districtId: foundDistrictId, // ← добавлено
      };

      // Обновляем форму и выбранный город ОДНОВРЕМЕННО
      setFormData(newFormData);
      setSelectedCityId(foundCityId); // это нужно для дропдауна
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
      if (
        !formData.title.trim() ||
        !formData.price ||
        !formData.area ||
        !selectedCityId ||
        !formData.districtId
      ) {
        toast.error("Пожалуйста, заполните все обязательные поля");
        return;
      }

      // Собираем payload СТРОГО по DTO бэкенда
      const payload = {
        // Основное
        title: formData.title,
        description: formData.description,
        type: formData.type, // "apartment" и т.д.
        status: "active" as const, // ← валидный статус

        // Гео
        city: formData.city,
        cityId: selectedCityId,
        district: formData.district,
        districtId: Number(formData.districtId),
        address: `${formData.street} ${formData.houseNumber}`.trim(),

        // Если в DTO есть отдельно street и houseNumber — раскомментируй:
        // street: formData.street,
        // houseNumber: formData.houseNumber,

        // Координаты
        latitude: formData.coordinates.lat || undefined,
        longitude: formData.coordinates.lng || undefined,

        // Площадь и комнаты
        area: Number(formData.area),
        rooms: Number(formData.bedrooms),
        floor: Number(formData.floor),
        totalFloors: Number(formData.totalFloors),

        // Цена
        price: Number(formData.price),
        currency: "KZT",

        // Фото — ИСПОЛЬЗУЙ ТОЧНОЕ ИМЯ ИЗ DTO
        photos: formData.images, // ← если в DTO "photos"
        // images: formData.images, // ← если в DTO "images"

        mainPhoto: formData.images[0] || undefined,

        // Удобства и доп. данные
        hasBalcony: !!formData.balcony?.toLowerCase().includes("балкон"),
        hasParking: !!formData.parking?.toLowerCase().includes("парковка"),
        yearBuilt: formData.yearBuilt ? Number(formData.yearBuilt) : undefined,
        condition: formData.condition || "excellent",

        // Мета
        isExclusive: false,
        views: 0,
        priority: 0,
      };

      await propertyApi.create(payload);
      toast.success("Объект успешно добавлен!");
    } catch (error: any) {
      console.error("Ошибка добавления объекта:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Не удалось добавить объект. Попробуйте позже.";
      toast.error(message);
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
      cityId: null,
      city: "",
      districtId: null,
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
                  <select
                    value={selectedCityId || ""}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setSelectedCityId(id || null);
                      // Сбросим район и адрес при смене города
                      setFormData((prev) => ({
                        ...prev,
                        city: cities.find((c) => c.id === id)?.name || "",
                        districtId: null, // ← очищаем, чтобы пользователь выбрал заново
                      }));
                    }}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите город</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCityId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Район *
                    </label>
                    <select
                      value={formData.districtId || ""}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        const district = districts.find((d) => d.id === id);
                        setFormData((prev) => ({
                          ...prev,
                          district: district?.name || "",
                          districtId: id,
                        }));
                      }}
                      required
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Выберите район</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
