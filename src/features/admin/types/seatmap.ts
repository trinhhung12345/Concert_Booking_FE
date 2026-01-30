export interface SeatMapElement {
  id: number;
  type: 'rect' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  data: string;
  display: number;
  sectionId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SeatMap {
  id: number;
  name: string;
  status: number;
  viewbox: string;
  showingId: number;
  createdAt?: string;
  updatedAt?: string;
  sections?: Section[];
}

export interface Section {
  id: number;
  name: string;
  seatMapId: number;
  status: number;
  isStage: boolean;
  isSalable: boolean;
  isReservingSeat: boolean;
  message: string;
  ticketTypeId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SectionAttribute {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
 rotate: number;
 fill: string;
  sectionId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Seat {
  id: number;
  code: string;
  row: number;
  col: number;
  status: 'AVAILABLE' | 'BOOKED' | 'SELECTED';
  isSalable: boolean;
  price: number;
  sectionId: number;
  createdAt?: string;
  updatedAt?: string;
}