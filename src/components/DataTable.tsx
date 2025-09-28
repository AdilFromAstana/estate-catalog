import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyState?: React.ReactNode;
  className?: string;
  rowClassName?: string;
}

export function DataTable<T>({
  columns,
  data,
  emptyState,
  className = "",
  rowClassName = "",
}: DataTableProps<T>) {
  return (
    <div
      className={`bg-white shadow-xl overflow-x-auto rounded-xl ${className}`}
    >
      <div className="min-w-full inline-block align-middle">
        {/* Header */}
        <div
          className="grid gap-4 py-3 px-4 font-semibold text-xs uppercase text-gray-500 border-b border-gray-200 bg-gray-50 rounded-t-xl"
          style={{
            gridTemplateColumns: columns.map(() => "1fr").join(" "),
          }}
        >
          {columns.map((col) => (
            <div key={col.key} className={col.className}>
              {col.header}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item, idx) => (
              <div
                key={idx}
                className={`grid gap-4 py-4 px-4 items-center hover:bg-gray-50 transition ${rowClassName}`}
                style={{
                  gridTemplateColumns: columns.map(() => "1fr").join(" "),
                }}
              >
                {columns.map((col) => (
                  <div key={col.key} className={col.className}>
                    {col.render(item)}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center">{emptyState}</div>
          )}
        </div>
      </div>
    </div>
  );
}
