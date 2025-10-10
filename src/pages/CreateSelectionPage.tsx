import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useCities, useDistricts } from "../hooks/useCities";
import { FilterContent } from "../components/SearchBar";
import PropertiesTable from "../components/SelectionPropertiesTable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyApi } from "../api/propertyApi";
import { useNavigate } from "react-router-dom";

export default function CreateSelectionPage() {
  const [mode, setMode] = useState<"filter" | "manual">("filter");
  const navigate = useNavigate();

  const [filters, setFilters] = useState<any>({});
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isShared, setIsShared] = useState(false);
  const queryClient = useQueryClient();

  const { data: cities } = useCities();
  const { data: districts } = useDistricts(filters.cityId || undefined);

  const createMutation = useMutation({
    mutationFn: (payload: any) => propertyApi.createSelection(payload),
    onSuccess: () => {
      toast.success("Подборка успешно создана!");
      queryClient.invalidateQueries({ queryKey: ["selections"] }); // обновляем список подборок
      navigate("/selections");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Ошибка при создании");
    },
  });

  // 🧠 вычисляем, можно ли активировать кнопку
  const isFormValid = useMemo(() => {
    if (!name.trim()) return false; // имя обязательно

    if (mode === "filter") {
      // должен быть хотя бы 1 ключ в фильтрах с непустым значением
      const hasFilter = Object.entries(filters).some(
        ([_, v]) =>
          v !== null && v !== "" && !(Array.isArray(v) && v.length === 0)
      );
      return hasFilter;
    }

    if (mode === "manual") {
      return selectedPropertyIds.length > 0;
    }

    return false;
  }, [name, filters, selectedPropertyIds, mode]);

  const handleCreate = () => {
    if (!isFormValid) {
      toast.error("Заполните обязательные поля перед сохранением");
      return;
    }

    const payload =
      mode === "filter"
        ? { name, description, isShared, filters }
        : { name, description, isShared, propertyIds: selectedPropertyIds };

    createMutation.mutate(payload);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-inter">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
        Создать подборку
      </h1>

      {/* выбор режима */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        {[
          {
            key: "filter",
            title: "По фильтрам",
            desc: "Динамическая подборка, автоматически обновляется при изменении объектов.",
          },
          {
            key: "manual",
            title: "Выбор вручную",
            desc: "Фиксированные объекты, выбираются вручную.",
          },
        ].map((opt) => (
          <div
            key={opt.key}
            onClick={() => setMode(opt.key as any)}
            className={`w-full p-6 border-2 rounded-xl cursor-pointer transition-colors ${
              mode === opt.key
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start">
              <input
                type="radio"
                checked={mode === opt.key}
                readOnly
                className="w-5 h-5 mt-1 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <div className="ml-4">
                <p className="text-xl font-semibold text-gray-800">
                  {opt.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">{opt.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* поля названия и описания */}
      <div className="bg-white rounded-xl p-6 md:p-8 border border-indigo-100 shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название подборки <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Двушки в центре"
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
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
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 mt-4 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={isShared}
            onChange={(e) => setIsShared(e.target.checked)}
            className="rounded border-gray-300"
          />
          Сделать общедоступной
        </label>
      </div>

      {/* контент */}
      {mode === "filter" ? (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow border border-indigo-100">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
            ⚙️ Настройка фильтров
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

          {Object.keys(filters).length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📊 Результаты по фильтрам
              </h3>
              <PropertiesTable
                selectedIds={[]}
                onSelect={() => {}}
                filters={filters}
                selectable={false}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow border border-indigo-100">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
            📝 Выбор объектов вручную
          </h2>
          <PropertiesTable
            selectable={true}
            selectedIds={selectedPropertyIds}
            onSelect={setSelectedPropertyIds}
          />
        </div>
      )}

      {/* кнопка сохранить */}
      <div className="mt-8 pt-6 border-t border-gray-300 flex justify-end">
        <button
          onClick={handleCreate}
          disabled={!isFormValid}
          className={`text-lg font-bold py-3 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl ${
            !isFormValid
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {"Сохранить подборку"}
        </button>
      </div>
    </div>
  );
}
