// src/pages/RealtorsPage.tsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Building,
  Star,
  Phone,
  Mail,
} from "lucide-react";
import type { Realtor } from "../types";

// Моковые данные риэлторов с казахскими именами
const mockRealtors: Realtor[] = [
  {
    id: "1",
    name: "Аскар Нурланов",
    email: "askar.nurlanov@realty.kz",
    phone: "+7 (701) 123-45-67",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    experience: 8,
    propertiesSold: 127,
    rating: 4.9,
    status: "active",
    description:
      "Специалист по элитной недвижимости. Помогу найти ваш идеальный дом.",
    joinedDate: "2020-03-15",
  },
  {
    id: "2",
    name: "Айгуль Токтарова",
    email: "aigul.toktarova@realty.kz",
    phone: "+7 (702) 987-65-43",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    experience: 12,
    propertiesSold: 203,
    rating: 4.8,
    status: "active",
    description:
      "Эксперт по загородной недвижимости. Знаю все лучшие предложения за городом.",
    joinedDate: "2019-01-22",
  },
  {
    id: "3",
    name: "Даурен Смаилов",
    email: "dauren.smailov@realty.kz",
    phone: "+7 (705) 456-78-90",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    experience: 5,
    propertiesSold: 89,
    rating: 4.7,
    status: "active",
    description:
      "Молодой и амбициозный риэлтор. Специализируюсь на новостройках.",
    joinedDate: "2021-07-10",
  },
  {
    id: "4",
    name: "Гульнара Есимова",
    email: "gulnara.esimova@realty.kz",
    phone: "+7 (777) 321-65-49",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    experience: 15,
    propertiesSold: 312,
    rating: 5.0,
    status: "active",
    description: "Ведущий специалист по коммерческой недвижимости.",
    joinedDate: "2018-05-30",
  },
  {
    id: "5",
    name: "Руслан Кенжебаев",
    email: "ruslan.kenzhebaev@realty.kz",
    phone: "+7 (701) 654-98-70",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    experience: 7,
    propertiesSold: 96,
    rating: 4.6,
    status: "inactive",
    description: "Специалист по аренде недвижимости.",
    joinedDate: "2020-11-18",
  },
  {
    id: "6",
    name: "Асель Бекова",
    email: "assel.bekova@realty.kz",
    phone: "+7 (702) 111-22-33",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    experience: 6,
    propertiesSold: 74,
    rating: 4.8,
    status: "active",
    description: "Эксперт по инвестиционной недвижимости.",
    joinedDate: "2021-03-05",
  },
  {
    id: "7",
    name: "Бекзат Алимов",
    email: "bekzat.alimov@realty.kz",
    phone: "+7 (705) 555-44-33",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    experience: 4,
    propertiesSold: 52,
    rating: 4.5,
    status: "pending",
    description: "Специалист по жилой недвижимости.",
    joinedDate: "2022-01-15",
  },
  {
    id: "8",
    name: "Айнур Сагинова",
    email: "aynur.saginova@realty.kz",
    phone: "+7 (777) 888-99-00",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    experience: 9,
    propertiesSold: 143,
    rating: 4.9,
    status: "active",
    description: "Эксперт по недвижимости в Алматы.",
    joinedDate: "2020-06-20",
  },
  {
    id: "9",
    name: "Ерлан Мусин",
    email: "erlan.musin@realty.kz",
    phone: "+7 (701) 222-33-44",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    experience: 11,
    propertiesSold: 187,
    rating: 4.7,
    status: "active",
    description: "Специалист по коммерческой недвижимости.",
    joinedDate: "2019-09-10",
  },
  {
    id: "10",
    name: "Жанар Касенова",
    email: "zhanar.kasenova@realty.kz",
    phone: "+7 (702) 333-44-55",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    experience: 3,
    propertiesSold: 38,
    rating: 4.4,
    status: "active",
    description: "Молодой специалист по аренде.",
    joinedDate: "2022-04-05",
  },
  {
    id: "11",
    name: "Тимур Болатов",
    email: "timur.bolatov@realty.kz",
    phone: "+7 (705) 666-77-88",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    experience: 6,
    propertiesSold: 91,
    rating: 4.6,
    status: "inactive",
    description: "Специалист по загородной недвижимости.",
    joinedDate: "2021-02-18",
  },
  {
    id: "12",
    name: "Алия Султанова",
    email: "aliya.sultanova@realty.kz",
    phone: "+7 (777) 999-00-11",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    experience: 8,
    propertiesSold: 112,
    rating: 4.8,
    status: "active",
    description: "Эксперт по инвестиционной недвижимости.",
    joinedDate: "2020-08-30",
  },
  {
    id: "13",
    name: "Нурлан Жунусов",
    email: "nurlan.zhusupov@realty.kz",
    phone: "+7 (701) 444-55-66",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    experience: 10,
    propertiesSold: 156,
    rating: 4.9,
    status: "active",
    description: "Ведущий специалист по элитной недвижимости.",
    joinedDate: "2019-04-12",
  },
  {
    id: "14",
    name: "Гаухар Мейрамбекова",
    email: "gaukhar.meirambeckova@realty.kz",
    phone: "+7 (702) 777-88-99",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    experience: 5,
    propertiesSold: 67,
    rating: 4.5,
    status: "pending",
    description: "Специалист по ипотечной недвижимости.",
    joinedDate: "2021-11-25",
  },
  {
    id: "15",
    name: "Арман Кайратов",
    email: "arman.kairatov@realty.kz",
    phone: "+7 (705) 111-22-33",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    experience: 7,
    propertiesSold: 89,
    rating: 4.7,
    status: "active",
    description: "Специалист по коммерческой аренде.",
    joinedDate: "2020-12-03",
  },
  {
    id: "16",
    name: "Айгерим Оспанова",
    email: "aigerim.ospanova@realty.kz",
    phone: "+7 (777) 222-33-44",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    experience: 4,
    propertiesSold: 45,
    rating: 4.3,
    status: "active",
    description: "Молодой специалист по жилой недвижимости.",
    joinedDate: "2022-02-14",
  },
  {
    id: "17",
    name: "Ермек Туlegenov",
    email: "ermeke.tulegenov@realty.kz",
    phone: "+7 (701) 333-44-55",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    experience: 9,
    propertiesSold: 134,
    rating: 4.8,
    status: "inactive",
    description: "Специалист по недвижимости в Астане.",
    joinedDate: "2020-05-17",
  },
  {
    id: "18",
    name: "Динара Ахметова",
    email: "dinara.akhmetova@realty.kz",
    phone: "+7 (702) 555-66-77",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    experience: 6,
    propertiesSold: 78,
    rating: 4.6,
    status: "active",
    description: "Эксперт по загородной недвижимости.",
    joinedDate: "2021-08-22",
  },
  {
    id: "19",
    name: "Санжар Бектуров",
    email: "sanzhar.bekturov@realty.kz",
    phone: "+7 (705) 888-99-00",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    experience: 3,
    propertiesSold: 32,
    rating: 4.2,
    status: "pending",
    description: "Начинающий специалист по аренде.",
    joinedDate: "2022-06-10",
  },
  {
    id: "20",
    name: "Айдана Кенжегулова",
    email: "aidana.kenzhegulova@realty.kz",
    phone: "+7 (777) 444-55-66",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    experience: 7,
    propertiesSold: 95,
    rating: 4.7,
    status: "active",
    description: "Специалист по инвестиционной недвижимости.",
    joinedDate: "2020-10-08",
  },
];

const statusOptions = [
  { value: "all", label: "Все статусы" },
  { value: "active", label: "Активный" },
  { value: "inactive", label: "Неактивный" },
  { value: "pending", label: "На проверке" },
];

const sortOptions = [
  { value: "name", label: "Имя" },
  { value: "experience", label: "Опыт" },
  { value: "propertiesSold", label: "Продажи" },
  { value: "rating", label: "Рейтинг" },
  { value: "joinedDate", label: "Дата регистрации" },
];

const RealtorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Фильтрация и сортировка риэлторов
  const filteredAndSortedRealtors = useMemo(() => {
    let result = [...mockRealtors];

    // Поиск
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (realtor) =>
          realtor.name.toLowerCase().includes(term) ||
          realtor.email.toLowerCase().includes(term)
      );
    }

    // Фильтр по статусу
    if (statusFilter !== "all") {
      result = result.filter((realtor) => realtor.status === statusFilter);
    }

    // Сортировка
    result.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Realtor];
      let bValue: any = b[sortBy as keyof Realtor];

      // Для дат преобразуем в timestamp
      if (sortBy === "joinedDate") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchTerm, statusFilter, sortBy, sortDirection]);

  // Пагинация
  const totalPages = Math.ceil(filteredAndSortedRealtors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRealtors = filteredAndSortedRealtors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Сброс пагинации при изменении фильтров
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, sortDirection]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Активный";
      case "inactive":
        return "Неактивный";
      case "pending":
        return "На проверке";
      default:
        return status;
    }
  };

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Риэлторы</h1>
        <p className="mt-1 text-sm text-gray-500">
          Список всех риэлторов с фильтрами и сортировкой
        </p>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Поиск */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Поиск по имени, email или специальности..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Фильтр по статусу */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Сортировка */}
          <div>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Сортировать по: {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                {sortDirection === "asc" ? (
                  <SortAsc className="h-5 w-5 text-gray-400" />
                ) : (
                  <SortDesc className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">
            Всего риэлторов
          </div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {mockRealtors.length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">Активные</div>
          <div className="mt-1 text-2xl font-semibold text-green-600">
            {mockRealtors.filter((r) => r.status === "active").length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">На проверке</div>
          <div className="mt-1 text-2xl font-semibold text-yellow-600">
            {mockRealtors.filter((r) => r.status === "pending").length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm font-medium text-gray-500">
            Средний рейтинг
          </div>
          <div className="mt-1 text-2xl font-semibold text-blue-600">
            {(
              mockRealtors.reduce((sum, r) => sum + r.rating, 0) /
              mockRealtors.length
            ).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Список риэлторов */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <ul className="divide-y divide-gray-200">
          {paginatedRealtors.length > 0 ? (
            paginatedRealtors.map((realtor) => (
              <li key={realtor.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={realtor.avatar}
                        alt={realtor.name}
                      />
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            {realtor.name}
                          </h3>
                          <span
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                              realtor.status
                            )}`}
                          >
                            {getStatusText(realtor.status)}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">
                            {realtor.rating}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-gray-600">
                            {realtor.experience} лет опыта
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/realtors/${realtor.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {realtor.email}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {realtor.phone}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Продаж:</span>{" "}
                        {realtor.propertiesSold}
                      </div>
                      <div className="mt-1 text-sm text-gray-900">
                        <span className="font-medium">Регистрация:</span>{" "}
                        {new Date(realtor.joinedDate).toLocaleDateString(
                          "ru-RU"
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-600">
                      {realtor.description}
                    </p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-8 text-center">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Риэлторы не найдены
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Попробуйте изменить параметры поиска или фильтрации.
              </p>
            </li>
          )}
        </ul>
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Показано <span className="font-medium">{startIndex + 1}</span> -{" "}
            <span className="font-medium">
              {Math.min(
                startIndex + itemsPerPage,
                filteredAndSortedRealtors.length
              )}
            </span>{" "}
            из{" "}
            <span className="font-medium">
              {filteredAndSortedRealtors.length}
            </span>{" "}
            риэлторов
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Назад
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Вперед
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtorsPage;
