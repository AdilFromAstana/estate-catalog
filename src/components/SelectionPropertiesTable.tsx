import { useState } from "react";
import { formatPrice } from "../api/propertyApi";
import { useProperties } from "../hooks/useProperties";

export default function PropertiesTable({
  selectedIds,
  onSelect,
  filters,
  selectable = false, // 👈 новый проп, по умолчанию включён
}: {
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
  filters?: any;
  selectable?: boolean; // 👈 добавили сюда
}) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: properties, isLoading } = useProperties({
    page,
    limit,
    ...filters,
  });
  const totalPages = properties?.totalPages || 1;

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelect(selectedIds.filter((v) => v !== id));
    } else {
      onSelect([...selectedIds, id]);
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const getPagination = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const pagination = getPagination();

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      {isLoading ? (
        <div className="p-6 text-center text-gray-500">Загрузка...</div>
      ) : (
        <>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {selectable && (
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length > 0 &&
                        selectedIds.length === properties?.data?.length
                      }
                      onChange={(e) =>
                        e.target.checked
                          ? onSelect(properties!.data!.map((p) => p.id))
                          : onSelect([])
                      }
                    />
                  </th>
                )}
                <th className="p-3 text-left font-medium text-gray-700">
                  Фото
                </th>
                <th className="p-3 text-left font-medium text-gray-700">
                  Название
                </th>
                <th className="p-3 text-left font-medium text-gray-700">
                  Цена
                </th>
                <th className="p-3 text-left font-medium text-gray-700">
                  Комнат
                </th>
              </tr>
            </thead>

            <tbody>
              {properties?.data?.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  {selectable && (
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
                  )}
                  <td className="p-3">
                    {p.photos && p.photos.length > 0 ? (
                      <img
                        src={p.photos[0]}
                        alt={p.title || "Фото"}
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-400 text-xs rounded-md border border-gray-200">
                        Нет фото
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium text-gray-800 truncate max-w-[200px]">
                    {p.title || "Без названия"}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {formatPrice(p.price)}
                  </td>
                  <td className="p-3">{p.rooms ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-100">
            <div className="flex items-center gap-1 flex-wrap">
              {pagination.map((item, idx) =>
                item === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className="px-2 text-gray-500 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item as number)}
                    className={`px-3 py-1.5 border rounded-md transition-colors ${
                      page === item
                        ? "bg-blue-600 text-white border-blue-600"
                        : "text-gray-700 border-gray-300 hover:bg-blue-50"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Показывать по:</span>
              <select
                value={limit}
                onChange={handleLimitChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
