export interface SeatAttribute {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
  fill: string;
  section?: null;
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
  display?: number;
  sectionId?: number;
}

export interface Seat {
  id: number;
  code: string;
  rowIndex: number;
  colIndex: number;
  sectionId: number;
  ticketTypeId?: number | null;
  seatElementId?: number | null;
  status: "AVAILABLE" | "BOOKED" | "LOCKED";
  price?: number;
}

export interface Section {
  id: number;
  name: string;
  isReservingSeat: boolean;
  isStage: boolean;
  status: number;
  isSalable: boolean;
  message?: string;
  seatMapId: number;
  ticketTypeId?: number | null;
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
