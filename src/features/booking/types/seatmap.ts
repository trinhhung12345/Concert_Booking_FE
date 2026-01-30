export interface SeatAttribute {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
  fill: string;
}

export interface MapElement {
  id: number;
  type: "rect" | "circle" | "path";
  x: number;
  y: number;
  width?: number;
  height?: number;
  fill: string;
  data?: string;
}

export interface Seat {
  id: number;
  code: string;
  rowIndex: number;
  colIndex: number;
  sectionId: number;
  status: "AVAILABLE" | "BOOKED" | "LOCKED";
  price?: number;
}

export interface Section {
  id: number;
  name: string;
  seats: Seat[];
  elements: MapElement[];
  attribute: SeatAttribute | null;
}

export interface SeatMapData {
  id: number;
  name: string;
  viewbox: string;
  sections: Section[];
}
