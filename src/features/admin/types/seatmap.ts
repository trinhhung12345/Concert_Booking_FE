export interface SeatMapElement {
  id: number;
  type: string; // Có thể là 'rect', 'circle', 'string', v.v.
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
  elements?: SeatMapElement[];
  attribute?: SectionAttribute;
  seats?: Seat[];
}

export interface SectionAttribute {
  id?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
  fill: string;
  sectionId?: number;
  section?: Section | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Seat {
  id: number;
  code: string;
  rowIndex: number;
 colIndex: number;
  status: 'AVAILABLE' | 'BOOKED' | 'SELECTED' | 'SOLD';
  isSalable: boolean;
  price: number | null;
  sectionId: number;
  createdAt?: string;
  updatedAt?: string;
}
