import { useCallback, useState } from "react";
import {
  ChevronLeft,
  Clock,
  LayoutGrid,
  ListChecks,
  Mail,
  Phone,
  Star,
} from "lucide-react";
import {
  getStatusClass,
  getStatusText,
  useRealtor,
  useToggleVisibility,
} from "../../hooks/useRealtor";
import { useNavigate, useParams } from "react-router-dom";
import SafeImage from "../../components/SafeImage";
import { ActivateToggleButton } from "./components/ActivateToggleButton";
import toast from "react-hot-toast";
import RealtorSelections from "../../components/RealtorSelections";
import RealtorProperties from "../../components/RealtorProperties";

const RealtorDetailPage: React.FC = () => {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: realtor } = useRealtor(id!);
  const [activeTab, setActiveTab] = useState("listings");

  const { mutate: toggleVisibilityMutation } = useToggleVisibility();

  const toggleVisibility = useCallback(
    (isActive: boolean) => {
      toggleVisibilityMutation(
        { id: Number(id), isActive },
        {
          onSuccess: () =>
            toast.success(
              `"${realtor?.firstName} ${realtor?.lastName}" теперь ${
                isActive ? "автивирован" : "деактивирован"
              }`
            ),
          onError: () => toast.error("Ошибка при изменении публикации"),
        }
      );
    },
    [toggleVisibilityMutation]
  );

  if (!realtor) return null;

  const tabs = [
    {
      id: "listings",
      label: "Объекты",
      icon: ListChecks,
      content: <RealtorProperties user={realtor} />,
    },
    {
      id: "selections",
      label: "Подборки",
      icon: LayoutGrid,
      content: <RealtorSelections user={realtor} />,
    },
  ];

  const statusClass = getStatusClass(realtor.isActive, realtor.isVerified);
  const statusText = getStatusText(realtor.isActive, realtor.isVerified);

  return (
    <div className="w-full mx-auto">
      {/* Header and Back Button */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <button
          className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium text-lg"
          onClick={() => nav(-1)}
        >
          <ChevronLeft className="h-6 w-6 mr-1" />
          Назад к списку риэлторов
        </button>
        <ActivateToggleButton
          isActive={realtor.isActive}
          onConfirm={toggleVisibility}
        />
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-xl shadow-2xl p-6 mb-8 border border-gray-200">
        <div className="flex items-center space-x-6">
          <SafeImage srcPath={realtor?.avatar} />
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
