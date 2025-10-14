// src/pages/RealtorsPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Building,
  Star,
  Mail,
  MoreVertical,
  Briefcase,
  ListChecks,
  Plus,
} from "lucide-react";
import {
  getStatusClass,
  getStatusText,
  useRealtors,
} from "../hooks/useRealtor";
import type { Realtor } from "../api/realtorApi";
import { useAuth } from "../AppContext";
import { PROPERTY_STATUS_OPTIONS } from "../contants/property-status";
import SafeImage from "../components/SafeImage";

const customStyles = {
  // Desktop table layout (min-width: 1024px)
  tableGridLg: {
    gridTemplateColumns: "minmax(250px, 2fr) 1fr 1fr 1fr 1fr 50px",
  },
  // Mobile/Tablet layout (less data shown)
  tableGridMd: {
    gridTemplateColumns: "minmax(180px, 1.5fr) 1fr 1fr 1fr 50px",
  },
};

const sortOptions = [{ value: "createdAt", label: "Дата регистрации" }];

const RealtorsPage: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sortBy: "createdAt",
    sortDirection: "ASC",
  });

  const { data, isLoading } = useRealtors(
    user?.agencyId!,
    currentPage,
    itemsPerPage,
    filters
  );

  const realtors = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  if (isLoading) {
    return <div className="p-6">Загрузка...</div>;
  }

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Риэлторы агентства
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Управление и отслеживание производительности сотрудников ({total}{" "}
            чел.)
          </p>
        </div>
        <button className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center">
          <Plus className="h-5 w-5 mr-2" /> Добавить
        </button>
      </div>

      {/* Фильтры и поиск (Улучшенная эстетика) */}
      <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Поиск */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Поиск по имени, email или телефону..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
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
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                {PROPERTY_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Сортировка */}
          <div>
            <div className="relative flex items-center">
              <select
                className="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-l-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                }
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    По: {option.label}
                  </option>
                ))}
              </select>
              <div
                className="p-2.5 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg cursor-pointer hover:bg-gray-200 transition"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    sortDirection:
                      prev.sortDirection === "ASC" ? "DESC" : "ASC",
                  }))
                }
              >
                {filters.sortDirection === "ASC" ? (
                  <SortAsc className="h-5 w-5 text-gray-600" />
                ) : (
                  <SortDesc className="h-5 w-5 text-gray-600" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Список риэлторов (Табличный вид) */}
      <div className="bg-white shadow-xl overflow-x-auto rounded-xl">
        <div className="min-w-full inline-block align-middle">
          {/* Table Header */}
          <div
            className="hidden lg:grid gap-4 p-4 font-semibold text-xs uppercase text-gray-500 border-b border-gray-200 bg-gray-50"
            style={customStyles.tableGridLg}
          >
            <div className="col-span-1">Сотрудник / Контакты</div>
            <div className="col-span-1">Дата рег.</div>
            <div className="col-span-1">Статус</div>
            <div className="text-center col-span-1">Активные объекты</div>
            <div className="text-center col-span-1">Сделки (30 дн)</div>
            <div className="col-span-1"></div> {/* Actions */}
          </div>

          {/* Table Rows Container */}
          <div className="divide-y divide-gray-100">
            {realtors.length > 0 ? (
              realtors.map((realtor: Realtor) => (
                <Link
                  key={realtor.id}
                  to={`/realtors/${realtor.id}`}
                  className="group transition-colors block hover:bg-blue-50"
                >
                  <div
                    className="grid gap-4 p-4 items-center"
                    style={
                      window.innerWidth >= 1024
                        ? customStyles.tableGridLg
                        : customStyles.tableGridMd
                    }
                  >
                    {/* Column 1: Employee / Contacts */}
                    <div className="flex items-center space-x-3 min-w-[150px] lg:min-w-auto">
                      <SafeImage srcPath={realtor?.avatar} />
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">
                          {realtor.firstName} {realtor.lastName}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                          <Mail className="h-3 w-3" />
                          <span>{realtor.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Created At (Hidden on small screens) */}
                    <div className="hidden lg:block text-sm text-gray-700">
                      {new Date(realtor.createdAt || "").toLocaleDateString(
                        "ru-RU"
                      )}
                    </div>

                    {/* Column 3: Status */}
                    <div className="min-w-[100px] lg:min-w-auto">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                          realtor.isActive,
                          realtor.isVerified
                        )}`}
                      >
                        {getStatusText(realtor.isActive, realtor.isVerified)}
                        <Star className="h-3 w-3 ml-1 text-yellow-500 fill-current" />
                        {/* {realtor.rating && realtor.rating > 4.5 && (
                        )} */}
                      </span>
                    </div>

                    {/* Column 4: Active Listings Count (Metric 1) */}
                    <div className="text-center">
                      <div className="text-lg font-extrabold text-blue-600 flex items-center justify-center space-x-1">
                        <ListChecks className="h-4 w-4 text-blue-500" />
                        {/* <span>{realtor.activeListingsCount}</span> */}
                      </div>
                      <p className="hidden lg:block text-xs text-gray-500 mt-0.5">
                        Объектов
                      </p>
                    </div>

                    {/* Column 5: Deals Count (Metric 2) */}
                    <div className="text-center">
                      <div className="text-lg font-extrabold text-green-600 flex items-center justify-center space-x-1">
                        <Briefcase className="h-4 w-4 text-green-500" />
                        {/* <span>{realtor.dealsCount30Days}</span> */}
                      </div>
                      <p className="hidden lg:block text-xs text-gray-500 mt-0.5">
                        Сделок
                      </p>
                    </div>

                    {/* Column 6: Action Button (More Details) */}
                    <div className="flex justify-end pr-2">
                      <button
                        className="p-2 text-gray-400 rounded-full group-hover:text-blue-600 hover:bg-gray-200 transition"
                        title="Подробнее"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation(); /* Link navigation handles action */
                        }}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <Building className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-base font-medium text-gray-900">
                  Риэлторы не найдены
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Попробуйте изменить параметры поиска или фильтрации.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-xl shadow">
          <div className="text-sm text-gray-700 mb-3 sm:mb-0">
            Показано{" "}
            <span className="font-bold">
              {Math.min((currentPage - 1) * itemsPerPage + 1, total)}
            </span>{" "}
            -{" "}
            <span className="font-bold">
              {Math.min(currentPage * itemsPerPage, total)}
            </span>{" "}
            из <span className="font-bold">{total}</span> риэлторов
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Назад
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
            >
              Вперёд
            </button>
          </div>
        </div>
      )}

      {/* Script to apply custom grid styles dynamically (required for proper responsiveness in this environment) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
        // Function to set the correct grid style based on screen width
        function setGridStyle() {
            const listItems = document.querySelectorAll('.grid.gap-4.p-4.items-center');
            const header = document.querySelector('.lg\\:grid.gap-4.p-4');
            
            const isLargeScreen = window.innerWidth >= 1024;
            const desktopStyle = "minmax(250px, 2fr) 1fr 1fr 1fr 1fr 50px";
            const mobileStyle = "minmax(180px, 1.5fr) 1fr 1fr 1fr 50px";

            if (header) {
                header.style.gridTemplateColumns = isLargeScreen ? desktopStyle : mobileStyle;
            }

            listItems.forEach(item => {
                item.style.gridTemplateColumns = isLargeScreen ? desktopStyle : mobileStyle;
            });
        }
        
        // Initial setup and listener
        setGridStyle();
        window.addEventListener('resize', setGridStyle);

        // Cleanup listener on component unmount (React best practice)
        // Note: In a real React app, this would be inside a useEffect hook.
        // For this single-file output, we use DOM manipulation.
        // Example: window.removeEventListener('resize', setGridStyle);

      `,
        }}
      />
    </div>
  );
};

export default RealtorsPage;
