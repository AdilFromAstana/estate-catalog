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
  images: string[]; // URL фотографий
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

export const astanaEstates: Estate[] = [
  {
    id: "1",
    externalId: "PR-2024-001",
    category: "apartment",
    city: "Астана",
    district: "Сарыаркинский район",
    microdistrict: "ЖК «Ак Шанырак»",
    street: "ул. Кунаева",
    houseNumber: "15",
    coordinates: { lat: 51.122399, lng: 71.430679 }, // Координаты ЖК
    price: 85000000,
    pricePerSquare: 450000,
    currency: "KZT",
    commissionType: "included",
    formOfOwnership: "ownership",
    totalArea: 85,
    livingArea: 42,
    kitchenArea: 12,
    roomCount: 3,
    floor: 7,
    totalFloors: 10,
    description:
      "Просторная 3-комнатная квартира в новом доме. Чистая продажа, собственность. Окна выходят на закрытый двор. Развитая инфраструктура: школы, детсады, ТРЦ «Москва» в 5 мин. езды.",
    condition: "excellent",
    renovation: "euro",
    amenities: [
      "балкон",
      "два санузла",
      "охрана",
      "паркинг",
      "консьерж",
      "мебель",
      "бытовая техника",
      "интернет",
    ],
    utilities: {
      heating: "central",
      water: "central",
      sewerage: "central",
    },
    images: [
      "https://astps-photos-kr.kcdn.kz/webp/0d/0d52c501-0afb-4695-9587-c2a2aea900b2/18-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/0d/0d52c501-0afb-4695-9587-c2a2aea900b2/19-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/0d/0d52c501-0afb-4695-9587-c2a2aea900b2/7-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/0d/0d52c501-0afb-4695-9587-c2a2aea900b2/20-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/0d/0d52c501-0afb-4695-9587-c2a2aea900b2/3-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/0d/0d52c501-0afb-4695-9587-c2a2aea900b2/4-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/0d/0d52c501-0afb-4695-9587-c2a2aea900b2/5-full.webp",
    ],
    agent: {
      id: "ag-123",
      name: "Алия Султанова",
      phone: "+77071234567",
      avatar: "https://example.com/agent1.jpg",
    },
    agency: {
      id: "agency-1",
      name: "Астана Элит Недвижимость",
      logo: "https://example.com/agency1-logo.png",
      phone: "+77172777777",
    },
    status: "active",
    isExclusive: true,
    views: 124,
    priority: 8,
    createdAt: "2024-08-15T10:00:00Z",
    updatedAt: "2024-08-28T16:30:00Z",
    krishaLink:
      "https://krisha.kz/a/show/1004913396?srchid=019901d1-5584-7592-90b1-fa44a31e9e35&srchtype=filter&srchpos=4",
    urgency: "active",
  },
  {
    id: "2",
    externalId: "PR-2024-002",
    category: "apartment",
    city: "Астана",
    district: "Есильский район",
    microdistrict: "ЖК «Триумф Астаны»",
    street: "пр. Туран",
    houseNumber: "24",
    coordinates: { lat: 51.1605, lng: 71.4704 }, // Координаты ЖК
    price: 120000000,
    pricePerSquare: 520000,
    currency: "KZT",
    commissionType: "additional",
    commissionValue: "50%",
    formOfOwnership: "ownership",
    totalArea: 105,
    livingArea: 58,
    kitchenArea: 15,
    roomCount: 4,
    floor: 12,
    totalFloors: 25,
    description:
      "Элитная 4-комнатная квартира в знаковом жилом комплексе с панорамными видами на город. Авторский дизайн-проект, премиальная отделка. Подземный паркинг, клубный двор.",
    condition: "excellent",
    renovation: "designer",
    amenities: [
      "балкон",
      "лоджия",
      "два санузла",
      "высокие потолки",
      "охрана",
      "паркинг",
      "консьерж",
      "кондиционер",
      "умный дом",
    ],
    images: [
      "https://astps-photos-kr.kcdn.kz/webp/e2/e27fd401-5e3f-4cc9-b16a-f5488709edf1/12-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/e2/e27fd401-5e3f-4cc9-b16a-f5488709edf1/1-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/e2/e27fd401-5e3f-4cc9-b16a-f5488709edf1/2-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/e2/e27fd401-5e3f-4cc9-b16a-f5488709edf1/3-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/e2/e27fd401-5e3f-4cc9-b16a-f5488709edf1/4-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/e2/e27fd401-5e3f-4cc9-b16a-f5488709edf1/5-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/e2/e27fd401-5e3f-4cc9-b16a-f5488709edf1/6-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/e2/e27fd401-5e3f-4cc9-b16a-f5488709edf1/7-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/e2/e27fd401-5e3f-4cc9-b16a-f5488709edf1/8-full.webp",
    ],
    agent: {
      id: "ag-124",
      name: "Арман Жуков",
      phone: "+77071234568",
      avatar: "https://example.com/agent2.jpg",
    },
    agency: {
      id: "agency-1",
      name: "Астана Элит Недвижимость",
      logo: "https://example.com/agency1-logo.png",
      phone: "+77172777777",
    },
    status: "active",
    isExclusive: true,
    views: 287,
    priority: 10,
    createdAt: "2024-08-10T14:20:00Z",
    updatedAt: "2024-08-29T11:15:00Z",
    krishaLink:
      "https://krisha.kz/a/show/1004427187?srchid=019901fb-2547-7ee2-9a85-49a6c430337c&srchtype=filter&srchpos=7",
    urgency: "hotDeal",
  },
  {
    id: "3",
    externalId: "PR-2024-003",
    category: "apartment",
    city: "Астана",
    district: "Алматинский район",
    microdistrict: "ЖК Aqzam",
    street: "ул. Сарайшык",
    houseNumber: "8",
    coordinates: { lat: 51.0908, lng: 71.4184 },
    price: 45000000,
    pricePerSquare: 380000,
    currency: "KZT",
    commissionType: "included",
    formOfOwnership: "ownership",
    totalArea: 65,
    livingArea: 35,
    kitchenArea: 10,
    roomCount: 2,
    floor: 5,
    totalFloors: 9,
    description:
      "Уютная 2-комнатная квартира в спальном районе. Идеальный вариант для первой покупки или инвестиции. Ремонт хороший, можно заезжать и жить. Рядом школа №65 и поликлиника.",
    condition: "good",
    renovation: "cosmetic",
    amenities: ["балкон", "охрана", "паркинг"],
    images: [
      "https://astps-photos-kr.kcdn.kz/webp/11/11278266-37f1-4ac7-a115-167620ebfacb/1-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/11/11278266-37f1-4ac7-a115-167620ebfacb/2-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/11/11278266-37f1-4ac7-a115-167620ebfacb/3-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/11/11278266-37f1-4ac7-a115-167620ebfacb/4-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/11/11278266-37f1-4ac7-a115-167620ebfacb/5-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/11/11278266-37f1-4ac7-a115-167620ebfacb/6-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/11/11278266-37f1-4ac7-a115-167620ebfacb/7-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/11/11278266-37f1-4ac7-a115-167620ebfacb/8-full.webp",
    ],
    agent: {
      id: "ag-125",
      name: "Гульнара Ибраева",
      phone: "+77071234569",
      avatar: "https://example.com/agent3.jpg",
    },
    agency: {
      id: "agency-2",
      name: "Центр Недвижимости Столица",
      logo: "https://example.com/agency2-logo.png",
      phone: "+77172788888",
    },
    status: "active",
    isExclusive: false,
    views: 89,
    priority: 5,
    createdAt: "2024-08-20T09:45:00Z",
    updatedAt: "2024-08-28T12:30:00Z",
    krishaLink:
      "https://krisha.kz/a/show/1004730814?srchid=019901f9-ca6f-717c-88de-ff1223a8332a&srchtype=hot_block_filter&srchpos=2",
    urgency: "inCollateral",
  },
  {
    id: "4",
    externalId: "NB-2024-001",
    category: "apartment",
    city: "Астана",
    district: "Сарыаркинский район",
    microdistrict: "ЖК «Expo Residence»",
    street: "ул. Мангилик Ел",
    houseNumber: "55",
    coordinates: { lat: 51.0925, lng: 71.4114 },
    price: 95000000,
    pricePerSquare: 470000,
    currency: "KZT",
    commissionType: "included",
    formOfOwnership: "ownership",
    totalArea: 92,
    livingArea: 50,
    kitchenArea: 14,
    roomCount: 3,
    floor: 14,
    totalFloors: 22,
    description:
      "Квартира в современном ЖК бизнес-класса от известного застройщика. Видовые характеристики, панорамное остекление. Сдача в эксплуатацию - Q2 2025. Возможна ипотека.",
    condition: "freeLayout",
    amenities: [
      "балкон",
      "лоджия",
      "охрана",
      "паркинг",
      "консьерж",
      "кондиционер",
    ],
    images: [
      "https://astps-photos-kr.kcdn.kz/webp/b5/b5abfe95-4573-4934-886c-7d407b3d3093/1-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/b5/b5abfe95-4573-4934-886c-7d407b3d3093/2-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/b5/b5abfe95-4573-4934-886c-7d407b3d3093/3-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/b5/b5abfe95-4573-4934-886c-7d407b3d3093/4-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/b5/b5abfe95-4573-4934-886c-7d407b3d3093/5-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/b5/b5abfe95-4573-4934-886c-7d407b3d3093/6-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/b5/b5abfe95-4573-4934-886c-7d407b3d3093/7-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/b5/b5abfe95-4573-4934-886c-7d407b3d3093/8-full.webp",
    ],
    agent: {
      id: "ag-126",
      name: "Дамир Касымов",
      phone: "+77071234570",
      avatar: "https://example.com/agent4.jpg",
    },
    agency: {
      id: "agency-3",
      name: "Базис Астана",
      logo: "https://example.com/agency3-logo.png",
      phone: "+77172789999",
    },
    status: "active",
    isExclusive: true,
    views: 201,
    priority: 9,
    createdAt: "2024-08-05T11:30:00Z",
    updatedAt: "2024-08-29T10:00:00Z",
    newBuilding: {
      name: "ЖК «Expo Residence»",
      developer: "BI Group",
      deadline: "2025-06-30",
      buildingStage: "finishing",
    },
    krishaLink:
      "https://krisha.kz/a/show/1004847209?srchid=019901f6-dfd4-7399-bac7-854e0367f7fc&srchtype=filter&srchpos=7",
      urgency: "onDeposit",
  },
  {
    id: "5",
    externalId: "NB-2024-002",
    category: "apartment",
    city: "Астана",
    district: "Сарыаркинский район",
    microdistrict: "ЖК Viva Plaza",
    street: "ул. Динмухамеда Кунаева",
    houseNumber: "12",
    coordinates: { lat: 51.0901, lng: 71.4176 },
    price: 185000000,
    pricePerSquare: 620000,
    currency: "KZT",
    commissionType: "included",
    formOfOwnership: "ownership",
    totalArea: 148,
    livingArea: 78,
    kitchenArea: 22,
    roomCount: 4,
    floor: 24,
    totalFloors: 32,
    description:
      "Элитная квартира в самом высоком жилом комплексе Центральной Азии. Панорамные виды на весь город, премиальная отделка от итальянских дизайнеров. Smart-home система, private лифты. Эксклюзивный вид на EXPO и набережную.",
    condition: "excellent",
    renovation: "designer",
    amenities: [
      "панорамный вид",
      "умный дом",
      "частный лифт",
      "консьерж",
      "охрана",
      "паркинг",
      "спортзал",
      "бассейн",
      "SPA",
      "кондиционер",
      "камин",
    ],
    images: [
      "https://astps-photos-kr.kcdn.kz/webp/95/95507342-38e9-4266-a02a-0883712a687b/27-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/95/95507342-38e9-4266-a02a-0883712a687b/13-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/95/95507342-38e9-4266-a02a-0883712a687b/1-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/95/95507342-38e9-4266-a02a-0883712a687b/3-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/95/95507342-38e9-4266-a02a-0883712a687b/4-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/95/95507342-38e9-4266-a02a-0883712a687b/5-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/95/95507342-38e9-4266-a02a-0883712a687b/6-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/95/95507342-38e9-4266-a02a-0883712a687b/7-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/95/95507342-38e9-4266-a02a-0883712a687b/8-full.webp",
    ],
    agent: {
      id: "ag-127",
      name: "Алия Султанова",
      phone: "+77071234571",
      avatar: "https://example.com/agent5.jpg",
    },
    agency: {
      id: "agency-1",
      name: "Астана Элит Недвижимость",
      logo: "https://example.com/agency1-logo.png",
      phone: "+77172777777",
    },
    status: "active",
    isExclusive: true,
    views: 456,
    priority: 10,
    createdAt: "2024-08-10T14:20:00Z",
    updatedAt: "2024-08-30T15:30:00Z",
    newBuilding: {
      name: "ЖК «Lightsail»",
      developer: "BI Group",
      deadline: "2024-12-31",
      buildingStage: "commissioned",
    },
    krishaLink: "https://krisha.kz/a/show/693669165",
    urgency: "hotDeal",
  },
  {
    id: "6",
    externalId: "NB-2024-003",
    category: "apartment",
    city: "Астана",
    district: "Есильский район",
    microdistrict: "ЖК «Асем Тас 2»",
    street: "пр. Керей Жанибек Хандар",
    houseNumber: "2",
    coordinates: { lat: 51.1489, lng: 71.4317 },
    price: 120000000,
    pricePerSquare: 550000,
    currency: "KZT",
    commissionType: "included",
    formOfOwnership: "ownership",
    totalArea: 161,
    livingArea: 145,
    kitchenArea: 18,
    roomCount: 5,
    floor: 5,
    totalFloors: 8,
    description:
      "Пентхаус с террасой 20м² в знаковом ЖК. Авторский дизайн-проект, материалы премиум-класса. Отдельная гардеробная, два санузла. Вид на главные достопримечательности города. Готовая элитная отделка.",
    condition: "excellent",
    renovation: "designer",
    amenities: [
      "терраса",
      "гардеробная",
      "два санузла",
      "премиальные материалы",
      "панорамный вид",
      "охрана",
      "консьерж",
      "паркинг",
      "спортзал",
    ],
    images: [
      "https://astps-photos-kr.kcdn.kz/webp/f4/f4cb8da2-b443-4b99-a262-59945614c42b/10-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/f4/f4cb8da2-b443-4b99-a262-59945614c42b/11-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/f4/f4cb8da2-b443-4b99-a262-59945614c42b/9-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/f4/f4cb8da2-b443-4b99-a262-59945614c42b/4-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/f4/f4cb8da2-b443-4b99-a262-59945614c42b/5-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/f4/f4cb8da2-b443-4b99-a262-59945614c42b/6-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/f4/f4cb8da2-b443-4b99-a262-59945614c42b/7-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/f4/f4cb8da2-b443-4b99-a262-59945614c42b/8-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/f4/f4cb8da2-b443-4b99-a262-59945614c42b/12-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/f4/f4cb8da2-b443-4b99-a262-59945614c42b/13-full.webp",
    ],
    agent: {
      id: "ag-128",
      name: "Арман Жуков",
      phone: "+77071234572",
      avatar: "https://example.com/agent6.jpg",
    },
    agency: {
      id: "agency-1",
      name: "Астана Элит Недвижимость",
      logo: "https://example.com/agency1-logo.png",
      phone: "+77172777777",
    },
    status: "active",
    isExclusive: true,
    views: 312,
    priority: 10,
    createdAt: "2024-08-12T09:15:00Z",
    updatedAt: "2024-08-29T16:45:00Z",
    newBuilding: {
      name: "ЖК «Triumph Astana»",
      developer: "BI Group",
      deadline: "2024-10-15",
      buildingStage: "commissioned",
    },
    krishaLink: "https://krisha.kz/a/show/762218069",
    urgency: "urgent",
  },
  {
    id: "7",
    externalId: "NB-2024-004",
    category: "apartment",
    city: "Астана",
    district: "Сарыарка район",
    microdistrict: "ЖК «Altyn Tau»",
    street: "ул. Кумисбекова",
    houseNumber: "4",
    coordinates: { lat: 51.1698, lng: 71.4492 },
    price: 85000000,
    pricePerSquare: 480000,
    currency: "KZT",
    commissionType: "included",
    formOfOwnership: "ownership",
    totalArea: 177,
    livingArea: 95,
    kitchenArea: 25,
    roomCount: 4,
    floor: 12,
    totalFloors: 18,
    description:
      "Просторная 4-комнатная квартира в закрытом клубном доме. Высокие потолки 3.2м, панорамное остекление. Современная планировка, качественная чистовая отделка. Развитая инфраструктура, охраняемая территория.",
    condition: "excellent",
    renovation: "euro",
    amenities: [
      "высокие потолки",
      "панорамные окна",
      "закрытая территория",
      "охрана",
      "консьерж",
      "паркинг",
      "детская площадка",
      "ландшафтный дизайн",
    ],
    images: [
      "https://krisha-photos.kcdn.online/webp/2d/2dd33e76-8e7e-42bf-8ef6-492fb7d675cf/3-full.webp",
      "https://krisha-photos.kcdn.online/webp/2d/2dd33e76-8e7e-42bf-8ef6-492fb7d675cf/2-full.webp",
      "https://krisha-photos.kcdn.online/webp/2d/2dd33e76-8e7e-42bf-8ef6-492fb7d675cf/1-full.webp",
      "https://krisha-photos.kcdn.online/webp/2d/2dd33e76-8e7e-42bf-8ef6-492fb7d675cf/4-full.webp",
      "https://krisha-photos.kcdn.online/webp/2d/2dd33e76-8e7e-42bf-8ef6-492fb7d675cf/5-full.webp",
      "https://krisha-photos.kcdn.online/webp/2d/2dd33e76-8e7e-42bf-8ef6-492fb7d675cf/6-full.webp",
      "https://krisha-photos.kcdn.online/webp/2d/2dd33e76-8e7e-42bf-8ef6-492fb7d675cf/7-full.webp",
      "https://krisha-photos.kcdn.online/webp/2d/2dd33e76-8e7e-42bf-8ef6-492fb7d675cf/8-full.webp",
    ],
    agent: {
      id: "ag-129",
      name: "Гульнара Ибраева",
      phone: "+77071234573",
      avatar: "https://example.com/agent7.jpg",
    },
    agency: {
      id: "agency-2",
      name: "Центр Недвижимости Столица",
      logo: "https://example.com/agency2-logo.png",
      phone: "+77172788888",
    },
    status: "active",
    isExclusive: false,
    views: 198,
    priority: 8,
    createdAt: "2024-08-15T11:30:00Z",
    updatedAt: "2024-08-28T14:20:00Z",
    newBuilding: {
      name: "ЖК «Nurly Tau»",
      developer: "Mega City",
      deadline: "2025-03-31",
      buildingStage: "finishing",
    },
    krishaLink: "https://krisha.kz/a/show/1001036351",
    urgency: "onDeposit",
  },
  {
    krishaLink: "https://krisha.kz/a/show/1004073298",
    id: "8",
    externalId: "NB-2024-005",
    category: "apartment",
    city: "Астана",
    district: "Есильский район",
    microdistrict: "ЖК «Nexpo City»",
    street: "ул. Рыскулова",
    houseNumber: "5/3",
    coordinates: { lat: 51.0912, lng: 71.4098 },
    price: 65000000,
    pricePerSquare: 420000,
    currency: "KZT",
    commissionType: "included",
    formOfOwnership: "ownership",
    totalArea: 155,
    livingArea: 82,
    kitchenArea: 20,
    roomCount: 3,
    floor: 9,
    totalFloors: 16,
    description:
      "Современная 3-комнатная квартира в развивающемся районе EXPO. Удачное расположение рядом с парком и набережной. Качественная чистовая отделка, возможность индивидуального планирования. Идеальное соотношение цена/качество.",
    condition: "good",
    renovation: "euro",
    amenities: [
      "балкон",
      "вид на парк",
      "качественная отделка",
      "охрана",
      "паркинг",
      "детская площадка",
    ],
    images: [
      "https://astps-photos-kr.kcdn.kz/webp/4c/4ce22e74-6347-4585-8ead-883e77737afb/14-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/4c/4ce22e74-6347-4585-8ead-883e77737afb/15-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/4c/4ce22e74-6347-4585-8ead-883e77737afb/16-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/4c/4ce22e74-6347-4585-8ead-883e77737afb/23-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/4c/4ce22e74-6347-4585-8ead-883e77737afb/21-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/4c/4ce22e74-6347-4585-8ead-883e77737afb/19-full.webp",
    ],
    agent: {
      id: "ag-130",
      name: "Дамир Касымов",
      phone: "+77071234574",
      avatar: "https://example.com/agent8.jpg",
    },
    agency: {
      id: "agency-3",
      name: "Базис Астана",
      logo: "https://example.com/agency3-logo.png",
      phone: "+77172789999",
    },
    status: "active",
    isExclusive: true,
    views: 167,
    priority: 7,
    createdAt: "2024-08-18T13:45:00Z",
    updatedAt: "2024-08-29T11:30:00Z",
    newBuilding: {
      name: "ЖК «Expo City»",
      developer: "BI Group",
      deadline: "2025-09-30",
      buildingStage: "building",
    },
    urgency: "inCollateral"
  },
  {
    krishaLink:
      "https://krisha.kz/a/show/699976408?srchid=01990212-5e52-792d-b006-49ff3404fd43&srchtype=hot_block_filter&srchpos=3",
    id: "9",
    externalId: "NB-2024-006",
    category: "apartment",
    city: "Астана",
    district: "Есильский район",
    microdistrict: "ЖК Времена года. Весна",
    street: "ул. Кабанбай батыра",
    houseNumber: "48а",
    coordinates: { lat: 51.1327, lng: 71.4283 },
    price: 95000000,
    pricePerSquare: 510000,
    currency: "KZT",
    commissionType: "included",
    formOfOwnership: "ownership",
    totalArea: 186,
    livingArea: 105,
    kitchenArea: 26,
    roomCount: 4,
    floor: 7,
    totalFloors: 12,
    description:
      "Элитная квартира в малоэтажном клубном доме европейского уровня. Авторская архитектура, private community. Высокие потолки 3.5м, камин, терраса. Эксклюзивное расположение в тихом центре города.",
    condition: "excellent",
    renovation: "designer",
    amenities: [
      "камин",
      "терраса",
      "высокие потолки",
      "закрытое сообщество",
      "охрана",
      "консьерж",
      "подземный паркинг",
      "сад",
    ],
    images: [
      "https://astps-photos-kr.kcdn.kz/webp/da/da46ec0a-fb47-4107-ab3b-e23cdfcdb5f5/118-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/da/da46ec0a-fb47-4107-ab3b-e23cdfcdb5f5/119-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/da/da46ec0a-fb47-4107-ab3b-e23cdfcdb5f5/120-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/da/da46ec0a-fb47-4107-ab3b-e23cdfcdb5f5/121-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/da/da46ec0a-fb47-4107-ab3b-e23cdfcdb5f5/122-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/da/da46ec0a-fb47-4107-ab3b-e23cdfcdb5f5/123-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/da/da46ec0a-fb47-4107-ab3b-e23cdfcdb5f5/124-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/da/da46ec0a-fb47-4107-ab3b-e23cdfcdb5f5/125-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/da/da46ec0a-fb47-4107-ab3b-e23cdfcdb5f5/126-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/da/da46ec0a-fb47-4107-ab3b-e23cdfcdb5f5/127-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/da/da46ec0a-fb47-4107-ab3b-e23cdfcdb5f5/128-full.webp",
    ],
    agent: {
      id: "ag-131",
      name: "Алия Султанова",
      phone: "+77071234575",
      avatar: "https://example.com/agent9.jpg",
    },
    agency: {
      id: "agency-1",
      name: "Астана Элит Недвижимость",
      logo: "https://example.com/agency1-logo.png",
      phone: "+77172777777",
    },
    status: "active",
    isExclusive: true,
    views: 289,
    priority: 9,
    createdAt: "2024-08-20T10:00:00Z",
    updatedAt: "2024-08-30T14:15:00Z",
    newBuilding: {
      name: "ЖК «Vesper»",
      developer: "Vesper Development",
      deadline: "2024-11-30",
      buildingStage: "commissioned",
    },
    urgency: "sold"
  },
  {
    krishaLink:
      "https://krisha.kz/a/show/1000379736?srchid=01990212-5e52-792d-b006-49ff3404fd43&srchtype=filter&srchpos=2",
    id: "10",
    externalId: "NB-2024-007",
    category: "apartment",
    city: "Астана",
    district: "Есильский район",
    microdistrict: "ЖК «BUQAR JYRAU EXCLUSIVE»",
    street: "ул. Туран",
    houseNumber: "52/5",
    coordinates: { lat: 51.1298, lng: 71.4276 },
    price: 145000000,
    pricePerSquare: 580000,
    currency: "KZT",
    commissionType: "included",
    formOfOwnership: "ownership",
    totalArea: 250,
    livingArea: 160,
    kitchenArea: 35,
    roomCount: 5,
    floor: 22,
    totalFloors: 28,
    description:
      "Пентхаус с панорамным видом на 360° в самом престижном ЖК города. Двухуровневая планировка, private лифт. Отделка мрамором и ценными породами дерева. Система умный дом премиум-класса. Эксклюзивное предложение.",
    condition: "excellent",
    renovation: "designer",
    amenities: [
      "пентхаус",
      "панорамный вид 360°",
      "двухуровневый",
      "частный лифт",
      "умный дом",
      "премиальные материалы",
      "консьерж",
      "охрана",
      "бассейн",
      "SPA",
      "спортзал",
    ],
    images: [
      "https://astps-photos-kr.kcdn.kz/webp/cb/cbf6a8d1-554f-4d59-b20f-9c44106dfed9/65-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/cb/cbf6a8d1-554f-4d59-b20f-9c44106dfed9/66-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/cb/cbf6a8d1-554f-4d59-b20f-9c44106dfed9/67-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/cb/cbf6a8d1-554f-4d59-b20f-9c44106dfed9/68-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/cb/cbf6a8d1-554f-4d59-b20f-9c44106dfed9/69-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/cb/cbf6a8d1-554f-4d59-b20f-9c44106dfed9/70-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/cb/cbf6a8d1-554f-4d59-b20f-9c44106dfed9/71-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/cb/cbf6a8d1-554f-4d59-b20f-9c44106dfed9/72-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/cb/cbf6a8d1-554f-4d59-b20f-9c44106dfed9/73-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/cb/cbf6a8d1-554f-4d59-b20f-9c44106dfed9/74-full.webp",
      "https://astps-photos-kr.kcdn.kz/webp/cb/cbf6a8d1-554f-4d59-b20f-9c44106dfed9/75-full.webp",
    ],
    agent: {
      id: "ag-132",
      name: "Арман Жуков",
      phone: "+77071234576",
      avatar: "https://example.com/agent10.jpg",
    },
    agency: {
      id: "agency-1",
      name: "Астана Элит Недвижимость",
      logo: "https://example.com/agency1-logo.png",
      phone: "+77172777777",
    },
    status: "active",
    isExclusive: true,
    views: 523,
    priority: 10,
    createdAt: "2024-08-22T16:30:00Z",
    updatedAt: "2024-08-31T12:00:00Z",
    newBuilding: {
      name: "ЖК «Orion»",
      developer: "Orion Properties",
      deadline: "2024-12-20",
      buildingStage: "commissioned",
    },
    urgency: "active"
  },
];

export interface Filters {
  category: string | null;
  district: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minArea: number | null;
  maxArea: number | null;
  rooms: number[];

  // Новые фильтры:
  minFloor: number | null; // Минимальный этаж
  maxFloor: number | null; // Максимальный этаж
  buildingType: string[]; // Тип дома: panel, brick, monolithic, etc.
  renovation: string[]; // Тип ремонта
  condition: string[]; // Состояние
  amenities: string[]; // Удобства (чекбоксы)
  hasPhoto: boolean | null; // Только с фото
  isExclusive: boolean | null; // Только эксклюзивы
  newBuilding: boolean | null; // Только новостройки
  minCeilingHeight: number | null; // Высота потолков
}
