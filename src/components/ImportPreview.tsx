import React from "react";
import type { ParsedPropertyData } from "../api/propertyApi";

interface Props {
  data: ParsedPropertyData;
}

export const ImportPreview: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="mt-4 border rounded-md p-4 bg-gray-50">
      <div className="flex gap-4">
        <img
          src={data.images?.[0] || "https://placehold.co/120x80?text=No+Image"}
          alt="preview"
          className="w-32 h-24 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="text-md font-semibold">{data.title}</h3>
          <p className="text-gray-600">
            {data.city}, {data.district}
          </p>
          <p className="text-green-600 font-bold mt-1">
            {data.price} {data.currency}
          </p>
        </div>
      </div>
    </div>
  );
};
