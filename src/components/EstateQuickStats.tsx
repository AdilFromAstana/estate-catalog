// components/EstateQuickStats.tsx
import React from "react";
import { Bed, Square, Ruler } from "lucide-react";
import type { PropertyResponse } from "../types";

interface Props {
  estate: PropertyResponse;
}

const EstateQuickStats: React.FC<Props> = ({ estate }) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
      <div className="text-center">
        <Bed size={24} className="mx-auto text-gray-600 mb-1" />
        <div className="font-semibold">{estate.rooms} комн.</div>
        <div className="text-sm text-gray-600">Комнат</div>
      </div>
      <div className="text-center">
        <Square size={24} className="mx-auto text-gray-600 mb-1" />
        <div className="font-semibold">{estate.area} м²</div>
        <div className="text-sm text-gray-600">Общая</div>
      </div>
      <div className="text-center">
        <Ruler size={24} className="mx-auto text-gray-600 mb-1" />
        <div className="font-semibold">
          {estate.floor}/{estate.totalFloors}
        </div>
        <div className="text-sm text-gray-600">Этаж</div>
      </div>
      {/* <div className="text-center">
        <Eye size={24} className="mx-auto text-gray-600 mb-1" />
        <div className="font-semibold">{estate.views}</div>
        <div className="text-sm text-gray-600">Просмотров</div>
      </div> */}
    </div>
  );
};

export default EstateQuickStats;
