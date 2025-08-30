import { useState } from "react";

export interface Filters {
  brand?: string; // марка машины
  model?: string; // модель
  fuel?: string; // бензин / дизель / электрика
  year?: string; // год выпуска
  transmission?: string;
}

interface FilterModalProps {
  filters: Filters;
  onApply: (key: keyof Filters, value: string) => void;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  filters,
  onApply,
  onClose,
}) => {
  const [activeField, setActiveField] = useState<keyof Filters | null>(null);

  return (
    <div className="fixed inset-0 bg-white z-50 p-4">
      <button onClick={onClose} className="mb-4">
        Закрыть ✖
      </button>

      {!activeField && (
        <div className="space-y-3">
          <button
            onClick={() => setActiveField("brand")}
            className="w-full p-3 border rounded"
          >
            Бренд: {filters.brand || "Выбрать"}
          </button>
          <button
            onClick={() => setActiveField("fuel")}
            className="w-full p-3 border rounded"
          >
            Топливо: {filters.fuel || "Выбрать"}
          </button>
          <button
            onClick={() => setActiveField("transmission")}
            className="w-full p-3 border rounded"
          >
            КПП: {filters.transmission || "Выбрать"}
          </button>
        </div>
      )}

      {activeField && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-4 border-t">
          <h3 className="font-semibold mb-3">Выбор {activeField}</h3>
          {["Бензин", "Дизель", "Электро"].map((option) => (
            <button
              key={option}
              className="block w-full p-2 text-left border-b"
              onClick={() => {
                onApply(activeField, option);
                setActiveField(null);
              }}
            >
              {option}
            </button>
          ))}
          <button
            onClick={() => setActiveField(null)}
            className="mt-3 w-full bg-gray-300 rounded p-2"
          >
            Назад
          </button>
        </div>
      )}
    </div>
  );
};
