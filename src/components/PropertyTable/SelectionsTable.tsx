import React from "react";
import clsx from "clsx";
import { Edit, Trash2, Share2, User } from "lucide-react";
import SafeImage from "../SafeImage";
import { Pagination } from "../PropertyTable/Pagination";
import type { Selection, SelectionsTableProps, SelectionTableAction } from "../../types";

export const SelectionsTable: React.FC<SelectionsTableProps> = ({
  selections,
  onEdit,
  onDelete,
  onShare,
  visibleFilters,
  visibleActions,
  visiblePagination,
  currentPage,
  total,
  pageSize,
  onPageChange,
  actions,
  filters,
  pagination,
  emptyText = "Нет подборок для отображения.",
}) => {
  const defaultActions: SelectionTableAction[] = [
    {
      label: "Редактировать",
      icon: <Edit size={18} />,
      onClick: (c) => onEdit(c.id),
      color: "blue",
    },
    {
      label: "Поделиться",
      icon: <Share2 size={18} />,
      onClick: (c) => onShare(c),
      color: "gray",
    },
    {
      label: "Удалить",
      icon: <Trash2 size={18} />,
      onClick: (c) => onDelete(c.id),
      color: "red",
    },
  ];

  const allActions = actions ?? defaultActions;

  const renderActions = (c: Selection) => {
    if (!visibleActions) return null;

    return (
      <div className="flex space-x-2 justify-end">
        {allActions
          .filter((a) => (a.visible ? a.visible(c) : true))
          .map((a) => (
            <button
              key={a.label}
              onClick={() => a.onClick(c)}
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

  const renderDesktopRow = (c: Selection) => (
    <div
      key={`${c.id}-desktop`}
      className="hidden lg:grid grid-cols-[minmax(200px,2fr)_minmax(150px,1fr)_minmax(160px,1fr)_minmax(140px,1fr)_minmax(150px,1fr)] gap-3 py-4 px-5 items-center hover:bg-blue-50 transition"
    >
      <div className="font-semibold text-gray-900 truncate">{c.name}</div>

      <div className="text-gray-600 truncate">{c.description || "—"}</div>

      <div className="flex items-center text-sm text-gray-800 whitespace-nowrap">
        <SafeImage srcPath={c.user.avatar} size={20} className="mr-2" />
        <div>
          <p className="font-medium truncate">
            {c.user.firstName || "Без имени"} {c.user.lastName || ""}
          </p>
          <p className="text-xs text-gray-500">{c.user.agency?.name}</p>
        </div>
      </div>

      <div className="text-center whitespace-nowrap">
        <span
          className={clsx(
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
            c.isShared
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          )}
        >
          {c.isShared ? "Публичная" : "Скрытая"}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 whitespace-nowrap">
        {visibleActions && renderActions(c)}
      </div>
    </div>
  );

  const renderMobileCard = (c: Selection) => (
    <div
      key={`${c.id}-mobile`}
      className="lg:hidden p-4 border-b border-gray-100 bg-white hover:bg-blue-50 transition"
    >
      <div className="flex justify-between">
        <div>
          <p
            onClick={() => onEdit(c.id)}
            className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer truncate"
          >
            {c.name}
          </p>
          <p className="text-sm text-gray-500 truncate mt-1">
            {c.description || "—"}
          </p>
          <div className="flex items-center text-xs text-gray-500 mt-2">
            <SafeImage srcPath={c.user.avatar} size={16} className="mr-2" />
            {c.user.firstName || "Без имени"} {c.user.lastName || ""} •{" "}
            {c.user.agency?.name}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(c.createdAt).toLocaleDateString("ru-RU")} •{" "}
            {c.isShared ? "Общая" : "Личная"}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
        <div className="flex items-center text-gray-700">
          <User size={14} className="mr-2 text-blue-500" />
          <span className="font-medium">
            {c.user ? `${c.user.firstName} ${c.user.lastName}` : "—"}
          </span>
        </div>
        {visibleActions && renderActions(c)}
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden w-full">
      {visibleFilters && filters && (
        <div className="p-4 border-b">{filters}</div>
      )}

      <div className="divide-y divide-gray-100">
        {selections.length > 0 ? (
          selections.map((c) => (
            <React.Fragment key={c.id}>
              {renderMobileCard(c)}
              {renderDesktopRow(c)}
            </React.Fragment>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-gray-500">{emptyText}</div>
        )}
      </div>

      {visiblePagination && (
        <div className="border-t p-4">
          {pagination ?? (
            <Pagination
              currentPage={currentPage ?? 1}
              total={total ?? 0}
              pageSize={pageSize ?? 10}
              onPageChange={onPageChange ?? (() => { })}
            />
          )}
        </div>
      )}
    </div>
  );
};
