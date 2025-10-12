// src/pages/SelectionDetailPage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PropertyCard from "./components/PropertyCard";
import PropertyListItem from "./components/PropertyListItem";
import SelectionInfoCard from "./components/SelectionInfoCard";
import SelectionViewToggle from "./components/SelectionViewToggle";
import { useSelection } from "../../hooks/useSelection";

export const SelectionDetailPage: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useSelection(Number(id));
  const [viewMode, setViewMode] = useState("grid");

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[70vh] text-gray-600">
        Загрузка подборки...
      </div>
    );

  if (isError || !data)
    return (
      <div className="text-center py-16 text-gray-500">
        Не удалось загрузить подборку 😔
      </div>
    );

  const { selection, properties, createdBy } = data;

  return (
    <div className="w-full mx-auto">
      <SelectionInfoCard
        selection={selection}
        total={properties.total}
        createdBy={createdBy}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Список объектов ({properties.total})
        </h2>
        <SelectionViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {properties?.data?.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.data.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {properties.data.map((p) => (
              <PropertyListItem key={p.id} p={p} />
            ))}
          </div>
        )
      ) : (
        <div className="py-16 text-center text-gray-500 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-medium mb-2">Объекты не найдены 😥</h3>
          <p>В этой подборке пока нет объектов.</p>
        </div>
      )}
    </div>
  );
};

export default SelectionDetailPage;
