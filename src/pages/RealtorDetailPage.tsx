import { useState } from "react";
import {
  Award,
  BarChart,
  ChevronLeft,
  Clock,
  Home,
  LayoutGrid,
  ListChecks,
  Mail,
  Phone,
  Star,
  Tag,
} from "lucide-react";
import { getStatusClass, getStatusText, useRealtor } from "../hooks/useRealtor";
import { useNavigate, useParams } from "react-router-dom";

// Заглушка контента для вкладки "Объекты"
const ListingsTab: React.FC<{ count: number }> = ({ count }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
    <h4 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
      <Home className="w-5 h-5 mr-2 text-blue-500" /> Активные объекты ({count})
    </h4>
    <p className="text-gray-600">
      Здесь будет список всех активных продаж, аренд и недвижимости,
      закрепленной за этим риэлтором.
    </p>
    <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
      <p className="text-sm font-medium text-blue-700">
        Пример: 3-комнатная квартира в ЖК "Астана Тауэрс" (Продажа), 1-комнатная
        в аренду (ул. Достык, 12).
      </p>
    </div>
  </div>
);

// Заглушка контента для вкладки "Коллекции"
const CollectionsTab: React.FC = () => (
  <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
    <h4 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
      <Tag className="w-5 h-5 mr-2 text-green-500" /> Коллекции/Категории
    </h4>
    <p className="text-gray-600">
      Раздел для отображения специализированных "коллекций" или целевых списков,
      которые ведет риэлтор.
    </p>
    <div className="mt-4 p-4 border border-green-200 bg-green-50 rounded-lg">
      <p className="text-sm font-medium text-green-700">
        Например: "Элитная недвижимость", "Продажа в старом городе", "Объекты с
        дисконтом".
      </p>
    </div>
  </div>
);

// Заглушка контента для вкладки "Статистика"
const StatsTab: React.FC<{ deals: number }> = ({ deals }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
    <h4 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
      <BarChart className="w-5 h-5 mr-2 text-purple-500" /> Статистика и метрики
    </h4>
    <p className="text-gray-600">
      Подробная статистика по эффективности, конверсии лидов и истории
      завершенных сделок.
    </p>
    <div className="mt-4 p-4 border border-purple-200 bg-purple-50 rounded-lg">
      <p className="text-sm font-medium text-purple-700">
        Завершено сделок за год: {deals + 15}. Средний цикл сделки: 45 дней.
      </p>
    </div>
  </div>
);

const RealtorDetailPage: React.FC = () => {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: realtor } = useRealtor(id!);
  const [activeTab, setActiveTab] = useState("listings");

  if (!realtor) return null;

  const tabs = [
    {
      id: "listings",
      label: "Объекты",
      icon: ListChecks,
      content: <ListingsTab count={0} />,
    },
    {
      id: "collections",
      label: "Коллекции",
      icon: LayoutGrid,
      content: <CollectionsTab />,
    },
    {
      id: "stats",
      label: "Статистика",
      icon: BarChart,
      content: <StatsTab deals={0} />,
    },
  ];

  const statusClass = getStatusClass(realtor.isActive, realtor.isVerified);
  const statusText = getStatusText(realtor.isActive, realtor.isVerified);

  return (
    <div className="py-6 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header and Back Button */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <button
          className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium text-lg"
          onClick={() => nav(-1)}
        >
          <ChevronLeft className="h-6 w-6 mr-1" />
          Назад к списку риэлторов
        </button>
        <button className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center">
          <Award className="h-5 w-5 mr-2" /> Наградить
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-xl shadow-2xl p-6 mb-8 border border-gray-200">
        <div className="flex items-center space-x-6">
          <img
            className="h-20 w-20 rounded-full object-cover shadow-md ring-4 ring-blue-100"
            src={
              realtor.avatar ||
              "https://placehold.co/80x80/f3f4f6/374151?text=A"
            }
            alt={`${realtor.firstName} ${realtor.lastName}`}
          />
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {realtor.firstName} {realtor.lastName}
            </h1>
            <p className="mt-1 text-gray-500 flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{realtor.email}</span>
            </p>
            <p className="mt-0.5 text-gray-500 flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{realtor.phone}</span>
            </p>
          </div>
        </div>

        {/* Stats and Status Row */}
        <div className="mt-5 border-t pt-4 flex flex-wrap gap-4 items-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}
          >
            {statusText}
          </span>
          <div className="flex items-center text-lg text-yellow-600 font-bold space-x-1">
            <Star className="h-5 w-5 fill-current" />
            <span>{realtor.rating && realtor.rating.toFixed(1)}</span>
            <span className="text-gray-500 font-normal ml-1 text-sm">
              (Рейтинг)
            </span>
          </div>
          <div className="flex items-center text-gray-700 space-x-1">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">С нами с:</span>
            <span>
              {realtor.createdAt &&
                new Date(realtor.createdAt).toLocaleDateString("ru-RU")}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-8 sticky top-0 bg-gray-50 z-10 rounded-t-xl shadow-md">
        <nav className="-mb-px flex space-x-8 px-6 pt-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } 
                  whitespace-nowrap py-3 px-1 border-b-2 font-medium text-base transition duration-150 ease-in-out flex items-center
                `}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tabs Content */}
      <div className="pb-8">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default RealtorDetailPage;
