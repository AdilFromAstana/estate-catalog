// src/components/PropertyFilters.tsx
import React from "react";
import { Search, XCircle, Filter } from "lucide-react";
import {
  PROPERTY_STATUS_OPTIONS,
} from "../../contants/property-status";
import type { PropertyStatus } from "../../types";

interface PropertyFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  status?: PropertyStatus;
  onStatusChange: (value?: PropertyStatus) => void;
  extraFilters?: React.ReactNode; // 👈 можно добавить фильтры типа "риелтор"
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  extraFilters,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-2 relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500"
          >
            <XCircle size={18} />
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Filter size={14} className="inline mr-1" /> Статус
        </label>
        <select
          value={status || ""}
          onChange={(e) =>
            onStatusChange((e.target.value as PropertyStatus) || undefined)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Все</option>
          {PROPERTY_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {extraFilters && <div>{extraFilters}</div>}
    </div>
  );
};
