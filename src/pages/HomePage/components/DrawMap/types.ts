import type { PropertyResponse } from "../../../../api/propertyApi";

export interface MapInstance extends ymaps.Map {}
export interface PolygonInstance extends ymaps.Polygon {}
export interface PolylineInstance extends ymaps.Polyline {}

export interface DrawMapProps {
  estates: PropertyResponse[];
}

export interface MapContainerProps {
  estates: PropertyResponse[];
  setFiltered: (list: PropertyResponse[]) => void;
  polygon: PolygonInstance | null;
  setPolygon: (poly: PolygonInstance | null) => void;
}

export interface MapControlsProps {
  map: MapInstance | null;
  polygon: PolygonInstance | null;
  setPolygon: (p: PolygonInstance | null) => void;
  polyline: PolylineInstance | null;
  setPolyline: (l: PolylineInstance | null) => void;
  estates: PropertyResponse[];
  setFiltered: (list: PropertyResponse[]) => void;
  isDrawing: boolean;
  setIsDrawing: (v: boolean) => void;
}

export interface DrawingToolProps {
  map: MapInstance | null;
  ymaps: typeof ymaps | null;
  isDrawing: boolean;
  estates: PropertyResponse[];
  polygon: PolygonInstance | null;
  setPolygon: (poly: PolygonInstance | null) => void;
  setFiltered: (list: PropertyResponse[]) => void;
}

export interface PropertyListProps {
  filtered: PropertyResponse[];
  polygon: PolygonInstance | null;
}

export interface UseMapClustersProps {
  map: MapInstance | null;
  estates: PropertyResponse[];
  polygon: PolygonInstance | null;
  setFiltered: (list: PropertyResponse[]) => void;
}
