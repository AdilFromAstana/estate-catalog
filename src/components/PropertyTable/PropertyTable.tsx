// src/components/PropertyTable.tsx
import React from "react";
import clsx from "clsx";
import {
  Edit,
  Eye,
  Trash2,
  MapPin,
  Square,
  Bed,
  Clock,
  User,
} from "lucide-react";
import {
  PROPERTY_STATUS_COLORS,
  PROPERTY_STATUS_LABELS,
} from "../../contants/property-status";
import { PropertyFilters } from "./PropertyFilters";
import { Pagination } from "./Pagination";
import { formatPrice, formatRooms } from "../../api/propertyApi";
import type { PropertyResponse, PropertyStatus } from "../../types";

export interface PropertyTableAction {
  label: string;
  icon: React.ReactNode;
  onClick: (property: PropertyResponse) => void;
  visible?: (property: PropertyResponse) => boolean;
  color?: "blue" | "red" | "gray";
}

interface PropertyTableProps {
  properties: PropertyResponse[];

  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (property: PropertyResponse) => void;

  /** Видимость секций */
  visibleFilters: boolean;
  visibleActions: boolean;
  visiblePagination: boolean;

  /** Фильтры и пагинация */
  searchTerm?: string;
  onSearchChange?: (v: string) => void;
  status?: string;
  onStatusChange?: (status: PropertyStatus | undefined) => void;
  currentPage?: number;
  total?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;

  /** Кастомизация */
  actions?: PropertyTableAction[];
  filters?: React.ReactNode;
  pagination?: React.ReactNode;

  emptyText?: string;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  onEdit,
  onDelete,
  onToggleVisibility,
  visibleFilters,
  visibleActions,
  visiblePagination,
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  currentPage,
  total,
  pageSize,
  onPageChange,
  actions,
  filters,
  pagination,
  emptyText = "Нет объектов для отображения.",
}) => {
  // 🔹 Базовые экшены по умолчанию
  const defaultActions: PropertyTableAction[] = [
    {
      label: "Редактировать",
      icon: <Edit size={18} />,
      onClick: (p) => onEdit(p.id),
      color: "blue",
    },
    {
      label: "Опубликовать / Скрыть",
      icon: <Eye size={18} />,
      onClick: (p) => onToggleVisibility(p),
      color: "gray",
    },
    {
      label: "Удалить",
      icon: <Trash2 size={18} />,
      onClick: (p) => onDelete(p.id),
      color: "red",
    },
  ];

  const allActions = actions ?? defaultActions;

  const renderActions = (p: PropertyResponse) => {
    if (!visibleActions) return null;

    return (
      <div className="flex space-x-2 justify-end">
        {allActions
          .filter((a) => (a.visible ? a.visible(p) : true))
          .map((a) => (
            <button
              key={a.label}
              onClick={() => a.onClick(p)}
              title={a.label}
              className={clsx(
                "p-2 rounded-lg hover:opacity-90 transition",
                a.color === "blue" &&
                  "bg-blue-100 text-blue-600 hover:bg-blue-200",
                a.color === "red" && "bg-red-100 text-red-600 hover:bg-red-200",
                a.color === "gray" &&
                  "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {a.icon}
            </button>
          ))}
      </div>
    );
  };

  // 🔹 Desktop версия строки
  const renderDesktopRow = (p: PropertyResponse) => (
    <div
      key={`${p.id}-row`}
      className="hidden lg:grid grid-cols-[minmax(220px,2fr)_minmax(120px,1fr)_minmax(130px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)] gap-3 py-4 px-5 items-center hover:bg-blue-50 transition"
    >
      {/* Объект */}
      <div className="flex items-center space-x-4 overflow-hidden">
        <img
          src={p.photos?.[0] || "https://placehold.co/120x80?text=Фото"}
          alt={p.title}
          className="h-20 w-28 rounded-lg object-cover border border-gray-200 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p
            onClick={() => onEdit(p.id)}
            title={p.title}
            className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer truncate"
          >
            {p.title}
          </p>
          <div className="flex items-center text-xs text-gray-500 mt-1 truncate">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            {p.district || "—"}, {p.city || "—"}
          </div>
          <div className="flex text-sm text-gray-700 mt-1 space-x-3">
            <span className="flex items-center">
              <Square size={14} className="mr-1 text-green-500" />
              {p.area} м²
            </span>
            <span className="flex items-center">
              <Bed size={14} className="mr-1 text-orange-500" />
              {formatRooms(p.rooms)}
            </span>
          </div>
        </div>
      </div>

      {/* Цена */}
      <div className="text-right font-bold text-blue-600 text-lg whitespace-nowrap">
        {formatPrice(p.price)}
      </div>

      {/* Статус */}
      <div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-${
            PROPERTY_STATUS_COLORS[p.status]
          }-100 text-${PROPERTY_STATUS_COLORS[p.status]}-800 whitespace-nowrap`}
        >
          {PROPERTY_STATUS_LABELS[p.status]}
        </span>
        <div className="text-xs text-gray-500 flex items-center mt-1 whitespace-nowrap">
          <Clock size={12} className="mr-1" />
          {new Date(p.updatedAt).toLocaleDateString("ru-RU")}
        </div>
      </div>

      {/* Риэлтор */}
      <div className="flex items-center text-sm text-gray-800 whitespace-nowrap">
        <User size={16} className="mr-2 text-blue-500 flex-shrink-0" />
        <span className="truncate">
          {p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : "—"}
        </span>
      </div>

      {/* Actions */}
      {visibleActions && <div>{renderActions(p)}</div>}
    </div>
  );

  // 🔹 Mobile карточка
  const renderMobileCard = (p: PropertyResponse) => (
    <div
      key={`${p.id}-card`}
      className="lg:hidden p-4 border-b border-gray-100 bg-white hover:bg-blue-50 transition"
    >
      <div className="flex space-x-4">
        <img
          src={p.photos?.[0] || "https://placehold.co/100x70?text=Фото"}
          alt={p.title}
          className="h-16 w-24 rounded-lg object-cover border border-gray-200"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <p
              onClick={() => onEdit(p.id)}
              title={p.title}
              className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer truncate"
            >
              {p.title}
            </p>
            <span
              className={`inline-flex ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-${
                PROPERTY_STATUS_COLORS[p.status]
              }-100 text-${PROPERTY_STATUS_COLORS[p.status]}-800`}
            >
              {PROPERTY_STATUS_LABELS[p.status]}
            </span>
          </div>

          <p className="text-blue-600 font-bold mt-1 text-lg">
            {formatPrice(p.price)}
          </p>

          <div className="flex flex-wrap items-center text-xs text-gray-500 mt-1 space-x-2">
            <span className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {p.district || "—"}
            </span>
            <span className="flex items-center">
              <Square size={12} className="mr-1 text-green-500" />
              {p.area} м²
            </span>
            <span className="flex items-center">
              <Bed size={12} className="mr-1 text-orange-500" />
              {formatRooms(p.rooms)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
        <div className="flex items-center text-gray-700">
          <User size={14} className="mr-2 text-blue-500" />
          <span className="font-medium">
            {p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : "—"}
          </span>
        </div>
        {visibleActions && renderActions(p)}
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden w-full">
      {/* Фильтры */}
      {visibleFilters && (
        <div className="p-4 border-b">
          {filters ?? (
            <PropertyFilters
              searchTerm={searchTerm ?? ""}
              onSearchChange={onSearchChange ?? (() => {})}
              status={status as any}
              onStatusChange={onStatusChange ?? (() => {})}
            />
          )}
        </div>
      )}

      {/* Список */}
      <div className="divide-y divide-gray-100">
        {properties.length > 0 ? (
          properties.map((p) => (
            <React.Fragment key={p.id}>
              {renderMobileCard(p)}
              {renderDesktopRow(p)}
            </React.Fragment>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">{emptyText}</div>
        )}
      </div>

      {/* Пагинация */}
      {visiblePagination && (
        <div className="border-t p-4">
          {pagination ?? (
            <Pagination
              currentPage={currentPage ?? 1}
              total={total ?? 0}
              pageSize={pageSize ?? 10}
              onPageChange={onPageChange ?? (() => {})}
            />
          )}
        </div>
      )}
    </div>
  );
};
