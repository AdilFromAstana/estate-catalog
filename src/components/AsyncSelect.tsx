// components/ui/AsyncComplexSelect.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useComplexSearch } from "../hooks/useComplexes";

interface AsyncComplexSelectProps {
  label: string;
  name: string;
  value: number | "";
  onChange: (val: number | "") => void;
  disabled?: boolean;
}

export const AsyncComplexSelect: React.FC<AsyncComplexSelectProps> = ({
  label,
  name,
  value,
  onChange,
  disabled,
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const { data: complexes = [], isLoading } = useComplexSearch(query);

  const handleSelect = (id: number, name: string) => {
    onChange(id);
    setQuery(name);
    setOpen(false);
  };

  // 💡 Функция для подсветки совпадений
  const highlightMatch = (text: string, search: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col gap-1 relative">
      <label
        className={`text-sm font-medium ${
          disabled ? "text-gray-400" : "text-gray-700"
        }`}
      >
        {label}
      </label>

      <div className="relative">
        <input
          type="text"
          name={name}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Введите название ЖК..."
          disabled={disabled}
          className={`w-full px-3 py-2 border rounded-md outline-none transition ${
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "border-gray-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
        <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
      </div>

      {open && (
        <div
          className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-56 overflow-auto"
          onMouseDown={(e) => e.preventDefault()}
        >
          {isLoading && (
            <div className="p-2 text-sm text-gray-500">Загрузка...</div>
          )}
          {!isLoading && complexes.length === 0 && query && (
            <div className="p-2 text-sm text-gray-500">Ничего не найдено</div>
          )}
          {!isLoading &&
            complexes.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelect(c.id, c.name)}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                  c.id === value ? "bg-blue-100" : ""
                }`}
              >
                {highlightMatch(c.name, query)}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
