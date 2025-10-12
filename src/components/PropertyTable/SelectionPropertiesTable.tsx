import React, { useState } from "react";
import { MapPin, Square, Bed, Calendar } from "lucide-react";
import { Pagination } from "./Pagination";
import { useProperties } from "../../hooks/useProperties";
import { formatPrice, formatRooms } from "../../api/propertyApi";

interface SelectionPropertiesTableProps {
  selectable?: boolean;
  selectedIds?: number[];
  onSelect?: (ids: number[]) => void;
  filters?: any;

  visiblePagination?: boolean;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;

  emptyText?: string;
}

export const SelectionPropertiesTable: React.FC<
  SelectionPropertiesTableProps
> = ({
  selectable = false,
  selectedIds = [],
  onSelect,
  filters,
  visiblePagination = true,
  currentPage,
  pageSize = 10,
  onPageChange,
  emptyText = "Нет объектов для отображения.",
}) => {
  const [page, setPage] = useState(currentPage ?? 1);
  const limit = pageSize;

  const { data, isLoading } = useProperties({
    page,
    limit,
    ...filters,
  });

  const properties = data?.data ?? [];
  const totalCount = data?.total ?? 0;

  const toggleSelect = (id: number) => {
    if (!onSelect) return;
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter((v) => v !== id));
    } else {
      onSelect([...selectedIds, id]);
    }
  };

  // === DESKTOP ROW ===
  const renderDesktopRow = (p: any) => (
    <div
      key={`desktop-${p.id}`}
      className={`hidden lg:grid ${
        selectable
          ? "grid-cols-[minmax(10px,1fr)_minmax(120px,15fr)_minmax(80px,2fr)_minmax(100px,2fr)]"
          : "grid-cols-[minmax(120px,8fr)_minmax(100px,2fr)_minmax(100px,2fr)]"
      }  gap-3 py-4 px-5 items-center hover:bg-indigo-50 transition`}
    >
      {selectable && (
        <input
          type="checkbox"
          checked={selectedIds.includes(p.id)}
          onChange={() => toggleSelect(p.id)}
          className="w-4 h-4 accent-indigo-600"
        />
      )}

      <div className="flex items-center space-x-4">
        <img
          src={p.photos?.[0] || "https://placehold.co/120x80?text=Фото"}
          alt={p.title}
          className="h-20 w-28 rounded-lg object-cover border border-gray-200"
        />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{p.title}</p>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <MapPin className="h-3 w-3 mr-1" />
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

      <div className="font-bold text-blue-600 text-lg whitespace-nowrap">
        {formatPrice(p.price)}
      </div>

      <div className="flex items-center justify-center text-sm text-gray-500 whitespace-nowrap">
        <Calendar size={14} className="mr-1 text-gray-400" />
        {new Date(p.createdAt).toLocaleDateString("ru-RU")}
      </div>
    </div>
  );

  // === MOBILE CARD ===
  const renderMobileCard = (p: any) => (
    <div
      key={`mobile-${p.id}`}
      className="lg:hidden p-4 border-b border-gray-100 bg-white hover:bg-indigo-50 transition"
    >
      <div className="flex items-start space-x-3">
        {selectable && (
          <input
            type="checkbox"
            checked={selectedIds.includes(p.id)}
            onChange={() => toggleSelect(p.id)}
            className="mt-1 w-4 h-4 accent-indigo-600"
          />
        )}
        <img
          src={p.photos?.[0] || "https://placehold.co/100x70?text=Фото"}
          alt={p.title}
          className="h-16 w-24 rounded-md object-cover border border-gray-200"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{p.title}</p>
          <p className="text-blue-600 font-bold mt-1">{formatPrice(p.price)}</p>
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
    </div>
  );

  return (
    <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden w-full">
      {isLoading ? (
        <div className="p-6 text-center text-gray-500">Загрузка...</div>
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {properties.length > 0 ? (
              properties.map((p) => (
                <React.Fragment key={p.id}>
                  {renderMobileCard(p)}
                  {renderDesktopRow(p)}
                </React.Fragment>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                {emptyText}
              </div>
            )}
          </div>

          {visiblePagination && (
            <div className="border-t p-4">
              <Pagination
                currentPage={page}
                total={totalCount}
                pageSize={limit}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  onPageChange?.(newPage);
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
