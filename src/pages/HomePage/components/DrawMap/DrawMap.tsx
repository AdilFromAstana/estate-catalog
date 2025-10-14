import React, { useState } from "react";
import MapContainer from "./MapContainer";
import PropertyList from "./PropertyList";
import type { DrawMapProps, PolygonInstance, PropertyResponse } from "../../../../types";


const DrawMap: React.FC<DrawMapProps> = ({ estates }) => {
  const [filtered, setFiltered] = useState<PropertyResponse[]>([]);
  const [polygon, setPolygon] = useState<PolygonInstance | null>(null);

  return (
    <div className="flex gap-4 flex-1 h-[75vh]">
      <MapContainer
        estates={estates}
        setFiltered={setFiltered}
        polygon={polygon}
        setPolygon={setPolygon}
      />

      <PropertyList filtered={filtered} polygon={polygon} />
    </div>
  );
};

export default DrawMap;
