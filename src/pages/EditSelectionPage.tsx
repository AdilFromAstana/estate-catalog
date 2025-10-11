import {
  Building,
  CheckCircle,
  Eye,
  Filter,
  ListFilter,
  Share2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useCities, useDistricts } from "../hooks/useCities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertyApi } from "../api/propertyApi";
import { useNavigate, useParams } from "react-router-dom";
import PropertiesTable from "../components/SelectionPropertiesTable";
import { FilterContent } from "../components/SearchBar";

export default function EditSelectionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  // --- Состояния ---
  const [mode, setMode] = useState<"filter" | "manual">("filter");
  const [filters, setFilters] = useState<any>({});
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isShared, setIsShared] = useState(false);

  // --- Подгружаем данные подборки ---
  const { data, isLoading } = useQuery({
    queryKey: ["selection", id],
    queryFn: () => propertyApi.getSelectionById(Number(id)),
    enabled: !!id,
  });

  // --- Город / районы ---
  const { data: cities } = useCities();
  const { data: districts } = useDistricts(filters.cityId || undefined);

  // --- Заполняем поля при загрузке ---
  useEffect(() => {
    if (data && data.selection) {
      setName(data.selection.name || "");
      setDescription(data.selection.description || "");
      setIsShared(data.selection.isShared || false);

      if (
        data.selection.filters &&
        Object.keys(data.selection.filters).length
      ) {
        setMode("filter");
        setFilters(data.selection.filters);
      } else if (data.selection.propertyIds?.length) {
        setMode("manual");
        setSelectedPropertyIds(data.selection.propertyIds);
      }
    }
  }, [data]);

  // --- Мутация обновления ---
  const updateMutation = useMutation({
    mutationFn: (payload: any) =>
      propertyApi.updateSelection(Number(id), payload),
    onSuccess: () => {
      toast.success("Подборка успешно обновлена!");
      queryClient.invalidateQueries({ queryKey: ["selections"] });
      navigate("/selections");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Ошибка при обновлении");
    },
  });

  // --- Проверка формы ---
  const isFormValid = useMemo(() => {
    if (!name.trim()) return false;
    if (mode === "filter") {
      const hasFilter = Object.entries(filters).some(
        ([_, v]) =>
          v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)
      );
      return hasFilter;
    }
    if (mode === "manual") return selectedPropertyIds.length > 0;
    return false;
  }, [name, filters, selectedPropertyIds, mode]);

  const handleUpdate = () => {
    if (!isFormValid) {
      toast.error("Заполните обязательные поля перед сохранением");
      return;
    }

    const payload =
      mode === "filter"
        ? { name, description, isShared, filters }
        : { name, description, isShared, propertyIds: selectedPropertyIds };

    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Загрузка данных подборки...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <Filter className="w-7 h-7 mr-3 text-indigo-600" />
          Редактировать подборку
        </h1>
        <p className="text-gray-500 mt-1">
          Настройте параметры и фильтры для обновления подборки.
        </p>
      </div>

      {/* Режим */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* По фильтрам */}
        <div
          onClick={() => setMode("filter")}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
            mode === "filter"
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-200 hover:border-indigo-300"
          }`}
        >
          <div className="flex items-center mb-2">
            {mode === "filter" ? (
              <ToggleRight className="w-6 h-6 text-indigo-600" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-gray-400" />
            )}
            <h3 className="ml-3 font-semibold text-lg text-gray-800">
              По фильтрам
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            Динамическая подборка, автоматически обновляется при изменении
            объектов.
          </p>
        </div>

        {/* Вручную */}
        <div
          onClick={() => setMode("manual")}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
            mode === "manual"
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-200 hover:border-indigo-300"
          }`}
        >
          <div className="flex items-center mb-2">
            {mode === "manual" ? (
              <ToggleRight className="w-6 h-6 text-indigo-600" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-gray-400" />
            )}
            <h3 className="ml-3 font-semibold text-lg text-gray-800">
              Выбор вручную
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            Фиксированные объекты, выбираются вручную (фильтры скрыты).
          </p>
        </div>
      </div>

      {/* Поля */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-indigo-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название подборки <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Двушки в центре"
              className="w-full p-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Например: Все квартиры до 50 млн ₸"
              className="w-full p-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>
        </div>

        <div className="flex items-center mt-4">
          <input
            id="public-toggle"
            type="checkbox"
            checked={isShared}
            onChange={(e) => setIsShared(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="public-toggle"
            className="ml-2 block text-sm text-gray-700 flex items-center"
          >
            <Share2 className="w-4 h-4 mr-1" />
            Сделать общедоступной
          </label>
        </div>
      </div>

      {/* Контент */}
      {mode === "filter" ? (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-20 border border-indigo-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center border-b pb-3">
            <Filter className="w-5 h-5 mr-3 text-indigo-600" />
            Настройка фильтров
          </h2>

          <FilterContent
            filters={filters}
            onFilterChange={(key, value) =>
              setFilters((prev: any) => ({ ...prev, [key]: value }))
            }
            onResetFilters={() => setFilters({})}
            filterOptions={{
              cities: cities || [],
              districts: districts || [],
              maxPrice: 100000000,
              rooms: [1, 2, 3, 4],
              minFloor: 1,
              maxFloor: 30,
            }}
          />

          {Object.keys(filters).length > 0 ? (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-indigo-600" />
                Результаты по фильтрам
              </h3>
              <PropertiesTable
                selectedIds={[]}
                onSelect={() => {}}
                filters={filters}
                selectable={false}
              />
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <ListFilter className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <p>
                Выберите параметры фильтрации для предварительного просмотра.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-20 border border-indigo-100">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6 flex items-center">
            <Building className="w-5 h-5 mr-2 text-indigo-600" />
            Выбор объектов вручную
          </h2>
          <PropertiesTable
            selectable={true}
            selectedIds={selectedPropertyIds}
            onSelect={setSelectedPropertyIds}
          />
        </div>
      )}

      {/* Footer */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t p-4 shadow-2xl flex justify-end">
        <button
          onClick={handleUpdate}
          disabled={!isFormValid}
          className={`flex items-center px-8 py-3 font-bold rounded-xl shadow-lg transition duration-300 transform ${
            !isFormValid
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105"
          }`}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}
