import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { DollarSign, TrendingUp, Users, Home } from "lucide-react";

// Мок-данные
const mockData = {
  // Общая статистика
  overallStats: {
    totalDeals: 127,
    totalRevenue: 2458000000,
    avgDealValue: 19350000,
    activeDeals: 34,
    closedDeals: 93,
  },

  // Статусы сделок
  dealStatuses: [
    { name: "Новые", value: 23, color: "#3b82f6" },
    { name: "В работе", value: 34, color: "#f59e0b" },
    { name: "На согласовании", value: 12, color: "#8b5cf6" },
    { name: "Закрытые", value: 93, color: "#10b981" },
    { name: "Отложенные", value: 8, color: "#f97316" },
    { name: "Отмененные", value: 5, color: "#ef4444" },
  ],

  // Суммы по статусам
  dealValuesByStatus: [
    { status: "Новые", amount: 420000000 },
    { status: "В работе", amount: 680000000 },
    { status: "На согласовании", amount: 230000000 },
    { status: "Закрытые", amount: 1890000000 },
    { status: "Отложенные", amount: 150000000 },
    { status: "Отмененные", amount: 95000000 },
  ],

  // Сделки по месяцам
  dealsByMonth: [
    { month: "Янв", deals: 8, revenue: 150000000 },
    { month: "Фев", deals: 12, revenue: 230000000 },
    { month: "Мар", deals: 15, revenue: 290000000 },
    { month: "Апр", deals: 18, revenue: 340000000 },
    { month: "Май", deals: 22, revenue: 420000000 },
    { month: "Июн", deals: 19, revenue: 380000000 },
    { month: "Июл", deals: 16, revenue: 310000000 },
    { month: "Авг", deals: 17, revenue: 330000000 },
  ],

  // Типы недвижимости
  propertyTypes: [
    { type: "Квартиры", count: 78, revenue: 1450000000, color: "#3b82f6" },
    { type: "Дома", count: 24, revenue: 620000000, color: "#10b981" },
    { type: "Коммерческая", count: 15, revenue: 320000000, color: "#f59e0b" },
    { type: "Земля", count: 10, revenue: 68000000, color: "#8b5cf6" },
  ],

  // Агенты
  agentsPerformance: [
    { name: "Алия Султанова", deals: 28, revenue: 540000000, rating: 4.8 },
    { name: "Арман Жуков", deals: 24, revenue: 480000000, rating: 4.6 },
    { name: "Гульнара Ибраева", deals: 21, revenue: 410000000, rating: 4.7 },
    { name: "Дамир Касымов", deals: 19, revenue: 380000000, rating: 4.5 },
    { name: "Айгерим Нурланова", deals: 16, revenue: 320000000, rating: 4.4 },
    { name: "Ерлан Мусин", deals: 19, revenue: 328000000, rating: 4.3 },
  ],

  // Регионы
  regions: [
    { region: "Алматы", deals: 45, revenue: 890000000 },
    { region: "Астана", deals: 38, revenue: 720000000 },
    { region: "Алма-Ата обл.", deals: 22, revenue: 410000000 },
    { region: "Акмолинская обл.", deals: 15, revenue: 280000000 },
    { region: "Другие", deals: 7, revenue: 158000000 },
  ],

  // Комиссии
  commissionStats: [
    { type: "Включена", count: 89, amount: 178000000 },
    { type: "Дополнительная", count: 23, amount: 69000000 },
    { type: "Процент от сделки", count: 15, amount: 95000000 },
  ],

  // Последние сделки
  recentDeals: [
    {
      id: "DL-2024-089",
      client: "Иванов Сергей",
      property: "3-комн. квартира",
      amount: 45000000,
      status: "Закрыта",
      date: "2024-08-15",
    },
    {
      id: "DL-2024-088",
      client: "Петрова Анна",
      property: "Частный дом",
      amount: 78000000,
      status: "В работе",
      date: "2024-08-14",
    },
    {
      id: "DL-2024-087",
      client: "Смирнов Дмитрий",
      property: "Офисное помещение",
      amount: 32000000,
      status: "Закрыта",
      date: "2024-08-13",
    },
    {
      id: "DL-2024-086",
      client: "Козлова Елена",
      property: "Участок ИЖС",
      amount: 15000000,
      status: "На согласовании",
      date: "2024-08-12",
    },
    {
      id: "DL-2024-085",
      client: "Морозов Алексей",
      property: "2-комн. квартира",
      amount: 28000000,
      status: "Закрыта",
      date: "2024-08-11",
    },
  ],
};

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState("year");

  // Форматирование чисел
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Форматирование валюты
  const formatCurrency = (amount: number) => {
    return `${formatNumber(Math.round(amount / 1000))} тыс. ₸`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Аналитика агентства
          </h1>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                timeRange === "month"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setTimeRange("month")}
            >
              Месяц
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                timeRange === "quarter"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setTimeRange("quarter")}
            >
              Квартал
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                timeRange === "year"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setTimeRange("year")}
            >
              Год
            </button>
          </div>
        </div>

        {/* Общая статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Всего сделок
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {mockData.overallStats.totalDeals}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Общий доход</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(mockData.overallStats.totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Средняя сделка
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(mockData.overallStats.avgDealValue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Активные</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {mockData.overallStats.activeDeals}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Графики */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Статусы сделок */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Статусы сделок</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.dealStatuses}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => {
                      const percentValue =
                        typeof percent === "number" ? percent : 0;
                      return `${name} ${(percentValue * 100).toFixed(0)}%`;
                    }}
                  >
                    {mockData.dealStatuses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Сделок"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Суммы по статусам */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Суммы по статусам</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.dealValuesByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis tickFormatter={(value) => `${value / 1000000} млн`} />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(Number(value)),
                      "Сумма",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="amount" name="Сумма" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Динамика сделок */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Динамика сделок по месяцам
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.dealsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `${value / 1000000} млн`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "deals") return [value, "Сделок"];
                    return [formatCurrency(Number(value)), "Доход"];
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="deals"
                  name="Сделок"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="Доход"
                  stroke="#10b981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Дополнительные метрики */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Типы недвижимости */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Типы недвижимости</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.propertyTypes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "count") return [value, "Объектов"];
                      return [formatCurrency(Number(value)), "Доход"];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" name="Объектов" fill="#3b82f6" />
                  <Bar dataKey="revenue" name="Доход" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Производительность агентов */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Производительность агентов
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.agentsPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "deals") return [value, "Сделок"];
                      if (name === "rating") return [value, "Рейтинг"];
                      return [formatCurrency(Number(value)), "Доход"];
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="deals"
                    name="Сделок"
                    fill="#3b82f6"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="revenue"
                    name="Доход"
                    fill="#10b981"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Последние сделки */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Последние сделки</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Клиент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Объект
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.recentDeals.map((deal) => (
                  <tr key={deal.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {deal.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deal.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deal.property}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(deal.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          deal.status === "Закрыта"
                            ? "bg-green-100 text-green-800"
                            : deal.status === "В работе"
                            ? "bg-yellow-100 text-yellow-800"
                            : deal.status === "На согласовании"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {deal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deal.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
