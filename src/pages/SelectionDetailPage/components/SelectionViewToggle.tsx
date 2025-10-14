// src/components/selection/SelectionViewToggle.tsx
import React from "react";
import { LayoutGrid, List } from "lucide-react";

const SelectionViewToggle: React.FC<{
  viewMode: 'grid' | 'list';
  setViewMode: (v: 'grid' | 'list') => void;
}> = ({ viewMode, setViewMode }) => (
  <div className="inline-flex rounded-xl shadow-lg border border-gray-200 bg-white">
    <button
      onClick={() => setViewMode("grid")}
      title="Вид сеткой"
      className={`p-3 rounded-l-xl transition duration-150 ${viewMode === "grid"
          ? "bg-blue-600 text-white"
          : "text-gray-500 hover:bg-gray-100"
        }`}
    >
      <LayoutGrid size={20} />
    </button>
    <button
      onClick={() => setViewMode("list")}
      title="Вид списком"
      className={`p-3 rounded-r-xl transition duration-150 ${viewMode === "list"
          ? "bg-blue-600 text-white"
          : "text-gray-500 hover:bg-gray-100"
        }`}
    >
      <List size={20} />
    </button>
  </div>
);
export default SelectionViewToggle;
