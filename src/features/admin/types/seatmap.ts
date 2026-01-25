// Type definitions for seatmap functionality

export interface SeatMapSectionAttribute {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
  fill: string;
  sectionId: number;
}

export interface SeatMapSection {
  id: number;
  name: string;
  seatMapId: number;
  status: number;
  isStage: boolean;
  isSalable: boolean;
  isReservingSeat: boolean;
  message: string;
  ticketTypeId: number | null;
  attribute: SeatMapSectionAttribute;
}

export interface SeatMapElement {
  id: number;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  data: string;
  display: number;
  sectionId: number;
}

export interface Seat {
  id: number;
  code: string;
  rowIndex: number;
  colIndex: number;
  sectionId: number;
  ticketTypeId?: number | null;
  seatElementId?: number | null;
  status: 'AVAILABLE' | 'BOOKED' | 'LOCKED';
  price?: number | null;
  isSalable?: boolean;
}

export interface SeatMap {
  id: number;
  name: string;
  status: number;
  viewbox: string;
  showingId: number;
  sections: SeatMapSection[];
  elements: SeatMapElement[];
}