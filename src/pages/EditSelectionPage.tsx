import React, { useState, useCallback, useEffect } from "react";
import {
  Save,
  Share2,
  Filter,
  Building,
  ListFilter,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// ==== MOCK DATA ====
const PAGINATION_SIZE = 10;
const TOTAL_PROPERTIES_COUNT = 1000000;

const baseMockProperties = [
  {
    id: 1,
    title: '2-комн. кв. 65 м² в ЖК "Престиж"',
    price: "48 500 000 ₸",
    date: "12.09.2025",
    address: "Астана, р-н Есиль",
  },
  {
    id: 2,
    title: '3-комн. кв. 88 м² в ЖК "Emerald"',
    price: "62 000 000 ₸",
    date: "10.09.2025",
    address: "Астана, р-н Алматы",
  },
  {
    id: 3,
    title: '1-комн. кв. 42 м² в ЖК "Nova"',
    price: "31 500 000 ₸",
    date: "08.09.2025",
    address: "Астана, р-н Сарыарка",
  },
];

const fetchPropertiesFromApi = (page: number, pageSize: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * pageSize;
      const data = Array.from({ length: pageSize }, (_, i) => {
        const base = baseMockProperties[i % baseMockProperties.length];
        return {
          ...base,
          id: start + i + 1,
          title: `Объект ${start + i + 1}: ${base.title}`,
        };
      });
      resolve(data);
    }, 400);
  });
};

// ==== UI Components ====

const Pagination = ({ total, pageSize, current, onChange, loading }: any) => {
  const totalPages = Math.ceil(total / pageSize);
  if (total <= pageSize) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border mt-4">
      <p className="text-sm text-gray-600">
        Показано {Math.min(current * pageSize, total)} из{" "}
        {total.toLocaleString()} объектов
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1 || loading}
          className="p-2 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="px-2 text-sm">
          Стр. {current} / {totalPages}
        </span>
        <button
          onClick={() => onChange(current + 1)}
          disabled={current === totalPages || loading}
          className="p-2 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const PropertyCheckbox = ({ id, checked, onChange }: any) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={onChange}
    className="cursor-pointer accent-indigo-600 w-4 h-4 md:w-5 md:h-5"
  />
);

const SelectionPropertiesTable = ({
  data,
  selectable,
  selected,
  toggle,
  pagination,
  loading,
}: any) => (
  <div className="relative">
    {loading && (
      <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-indigo-600 font-semibold">
        Загрузка…
      </div>
    )}
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {selectable && <th className="pl-6 w-10"></th>}
              <th className="px-6 py-3 text-left text-xs text-gray-500">
                Объект
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">
                Цена
              </th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">
                Дата
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50">
                {selectable && (
                  <td className="pl-6">
                    <PropertyCheckbox
                      id={`p-${p.id}`}
                      checked={selected.includes(p.id)}
                      onChange={() => toggle(p.id)}
                    />
                  </td>
                )}
                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                  {p.title}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                  {p.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden p-4 space-y-3">
        {data.map((p: any) => (
          <div
            key={p.id}
            className="flex items-start p-3 border rounded-xl bg-white shadow-sm"
          >
            {selectable && (
              <div className="mr-3 pt-1">
                <PropertyCheckbox
                  id={`m-${p.id}`}
                  checked={selected.includes(p.id)}
                  onChange={() => toggle(p.id)}
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex justify-between text-sm font-semibold text-gray-800">
                {p.title}
                <span className="text-indigo-600 font-bold ml-2">
                  {p.price.split(" ")[0]}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{p.address}</div>
              <div className="text-xs text-gray-400 mt-1">
                Добавлен: {p.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Pagination {...pagination} loading={loading} />
  </div>
);

const ModeSelector = ({ mode, setMode }: any) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
    {[
      {
        key: "filters",
        icon: Filter,
        title: "По фильтрам",
        desc: "Динамическая подборка, автоматически обновляется.",
      },
      {
        key: "manual",
        icon: Building,
        title: "Вручную",
        desc: "Фиксированные объекты, выбираются вручную.",
      },
    ].map(({ key, icon: Icon, title, desc }) => (
      <div
        key={key}
        onClick={() => setMode(key)}
        className={`cursor-pointer border-2 rounded-2xl p-5 transition-all ${
          mode === key
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-200 hover:border-indigo-300"
        }`}
      >
        <div className="flex items-center mb-2">
          {mode === key ? (
            <ToggleRight className="w-5 h-5 text-indigo-600" />
          ) : (
            <ToggleLeft className="w-5 h-5 text-gray-400" />
          )}
          <h3 className="ml-2 font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    ))}
  </div>
);

const HeaderSection = ({ onSave, disabled, saving }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
        <Filter className="w-6 h-6 text-indigo-600 mr-2" />
        Редактировать подборку
      </h1>
      <p className="text-gray-500 text-sm mt-1">
        Настройте параметры и фильтры для обновления подборки.
      </p>
    </div>
    <button
      onClick={onSave}
      disabled={disabled || saving}
      className={`hidden sm:flex items-center px-5 py-2 rounded-xl font-semibold transition shadow-md ${
        disabled || saving
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
    >
      <Save className="w-4 h-4 mr-2" />
      {saving ? "Сохранение…" : "Сохранить"}
    </button>
  </div>
);

const SaveButtonStickyFooter = ({ onSave, disabled, saving }: any) => (
  <div className="fixed bottom-0 inset-x-0 bg-white border-t p-4 shadow-lg sm:hidden">
    <button
      onClick={onSave}
      disabled={disabled || saving}
      className={`w-full py-3 rounded-xl font-semibold text-lg ${
        disabled || saving
          ? "bg-gray-300 text-gray-600"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
    >
      <Save className="w-5 h-5 inline mr-2" />
      {saving ? "Сохранение…" : "Сохранить изменения"}
    </button>
  </div>
);

// ==== MAIN ====
export default function EditSelectionPage() {
  const [mode, setMode] = useState("filters");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("Двушки до 50 млн");
  const [desc, setDesc] = useState("Отличные варианты рядом с парком.");
  const [isPublic, setIsPublic] = useState(true);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    const res: any = await fetchPropertiesFromApi(p, PAGINATION_SIZE);
    setData(res);
    setLoading(false);
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  const toggleSelect = (id: number) => {
    setSelected((s) =>
      s.includes(id) ? s.filter((i) => i !== id) : [...s, id]
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    setSaving(true);
    console.log("SAVE:", { name, desc, isPublic, mode, selected });
    setTimeout(() => setSaving(false), 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-10 px-4 sm:px-6 lg:px-8 pt-6">
      <HeaderSection onSave={handleSave} disabled={!name} saving={saving} />

      <ModeSelector mode={mode} setMode={setMode} />

      <div className="bg-white rounded-xl p-5 mb-6 border">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Название подборки *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Например: Двушки в центре"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Описание
            </label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Например: До 50 млн ₸"
            />
          </div>
        </div>

        <label className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 accent-indigo-600"
          />
          <span className="ml-2 text-sm text-gray-700 flex items-center">
            <Share2 className="w-4 h-4 mr-1 text-indigo-500" />
            Сделать общедоступной
          </span>
        </label>
      </div>

      {mode === "filters" ? (
        <div>
          <h2 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
            <ListFilter className="w-5 h-5 text-indigo-600 mr-2" />
            Результаты по фильтрам
          </h2>
          <SelectionPropertiesTable
            data={data}
            selectable={false}
            selected={selected}
            toggle={toggleSelect}
            pagination={{
              total: TOTAL_PROPERTIES_COUNT,
              pageSize: PAGINATION_SIZE,
              current: page,
              onChange: setPage,
            }}
            loading={loading}
          />
        </div>
      ) : (
        <div>
          <h2 className="flex items-center text-lg font-semibold text-indigo-700 mb-4">
            <Building className="w-5 h-5 text-indigo-600 mr-2" />
            Выбор объектов вручную
          </h2>
          <AlertTriangle className="w-5 h-5 text-indigo-500 inline mr-2" />
          <span className="text-sm text-indigo-700">
            В ручном режиме можно выбирать объекты вручную.
          </span>
          <SelectionPropertiesTable
            data={data}
            selectable
            selected={selected}
            toggle={toggleSelect}
            pagination={{
              total: TOTAL_PROPERTIES_COUNT,
              pageSize: PAGINATION_SIZE,
              current: page,
              onChange: setPage,
            }}
            loading={loading}
          />
        </div>
      )}

      <SaveButtonStickyFooter
        onSave={handleSave}
        disabled={!name}
        saving={saving}
      />
    </div>
  );
}
