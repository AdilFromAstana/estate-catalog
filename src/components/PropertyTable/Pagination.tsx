// src/components/Pagination.tsx
import React from "react";

interface PaginationProps {
  currentPage: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  total,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Показано{" "}
        <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>{" "}
        -{" "}
        <span className="font-medium">
          {Math.min(currentPage * pageSize, total)}
        </span>{" "}
        из <span className="font-medium">{total}</span>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Назад
        </button>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Вперёд
        </button>
      </div>
    </div>
  );
};
