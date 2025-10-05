export interface Estate {
  // 1. Базовый идентификатор
  id: string;
  externalId?: string; // ID из CRM агентства (ОЧЕНЬ важно для синхронизации)

  // 2. Тип недвижимости (ТОЛЬКО для продажи)
  category: "apartment" | "house" | "commercial" | "land" | "townhouse"; // Квартира, Дом, Коммерческая, Участок, Таунхаус

  // 3. Локация и адрес (Обязательно с координатами)
  city: string; // e.g., "Алматы"
  district: string; // e.g., "Бостандыкский район"
  microdistrict?: string; // e.g., "Алматы" (Микрорайон)
  street: string; // e.g., "ул. Назарбаева"
  houseNumber: string; // e.g., "42"
  coordinates: {
    // Для карты (Яндекс/2GIS)
    lat: number; // Широта (X)
    lng: number; // Долгота (Y)
  };

  // 4. Финансы
  price: number; // Общая цена (₸ или $)
  pricePerSquare?: number; // Цена за м² (вычисляемое/бэкенд)
  currency: "KZT" | "USD"; // Валюта
  commissionType?: "included" | "additional"; // "Включена в цену" или "+
  commissionValue?: number | string; // Размер комиссии (фикс сумма или "50%")
  formOfOwnership?: "ownership" | "common"; // "Собственность" или "Долевая"

  // 5. Основные параметры объекта
  totalArea: number; // Общая площадь (м²)
  livingArea?: number; // Жилая площадь (м²)
  kitchenArea?: number; // Площадь кухни (м²)
  landArea?: number; // Площадь участка (сотки)
  roomCount: number; // Кол-во комнат (1, 2, 3... или 0 для студии)
  floor: number; // Этаж
  totalFloors: number; // Всего этажей в доме

  // 6. Описание и состояние
  description: string; // Детальное описание
  condition:
    | "excellent"
    | "good"
    | "needsRenovation"
    | "freeLayout"
    | "unfinished"; // Состояние: "Отличное", "Хорошее", "Требует ремонта", "Свободная планировка", "Незавершенка"
  renovation?: "euro" | "designer" | "cosmetic" | "without"; // "Евроремонт", "Дизайнерский", "Косметический", "Без ремонта"

  // 7. Особенности и удобства (Массивы для фильтров - ОЧЕНЬ ВАЖНО)
  amenities: string[]; // e.g.: [
  //   "balcony", "loggia", "twoBathrooms", "highCeilings",
  //   "security", "parking", "concierge", "furniture",
  //   "appliances", "internet", "phone", "ac"
  // ];

  // 8. Коммуникации (Для домов/участков)
  utilities?: {
    heating: "gas" | "electric" | "central"; // Отопление: газ, электро, центральное
    water: "central" | "well" | "borehole"; // Вода: центральная, скважина
    sewerage: "central" | "septic"; // Канализация: центральная, септик
  };

  // 9. Медиа
  photos: string[]; // URL фотографий
  videoTour?: string; // URL видео-тура
  virtualTour?: string; // URL 3D-тура (Matterport)
  floorPlan?: string; // URL планировки
  documents?: string[]; // URL документов (сканеры права собственности)

  // 10. Контакты и метаданные (ВЗЯТЬ ИЗ CRM АГЕНТСТВА)
  agent: {
    id: string; // ID из CRM
    name: string;
    phone: string;
    avatar?: string;
  };
  agency: {
    id: string; // ID из CRM
    name: string;
    logo: string;
    phone: string;
  };

  // 11. Статусы и аналитика
  status: "active" | "reserved" | "sold" | "hidden"; // Активно, Забронировано, Продано, Скрыто
  isExclusive: boolean; // Эксклюзивный договор
  views: number; // Кол-во просмотров
  priority: number; // Приоритет в выдаче (0-10)
  createdAt: string; // Дата создания (ISO)
  updatedAt: string; // Дата обновления (ISO)

  // 12. ДЛЯ НОВОСТРОЕК (От застройщика)
  newBuilding?: {
    name: string; // Название ЖК ("ЖК Горизонт")
    developer: string; // Застройщик
    deadline: string; // Срок сдачи (Q2 2025)
    buildingStage: "foundation" | "building" | "finishing" | "commissioned"; // Стадия: "фундамент", "возведение", "отделка", "сдан"
  };

  krishaLink?: string;
  urgency: keyof typeof urgencyLabels;
}

export const urgencyLabels = {
  urgent: {
    text: "Срочно",
    color: "bg-red-500",
    textColor: "text-white",
  },
  hotDeal: {
    text: "Горящий вариант",
    color: "bg-orange-500",
    textColor: "text-white",
  },
  active: {
    text: "Активно",
    color: "bg-green-500",
    textColor: "text-white",
  },
  onDeposit: {
    text: "На задатке",
    color: "bg-yellow-500",
    textColor: "text-gray-800",
  },
  sold: {
    text: "Продано",
    color: "bg-gray-500",
    textColor: "text-white",
  },
  inCollateral: {
    text: "В залоге",
    color: "bg-blue-500",
    textColor: "text-white",
  },
};
