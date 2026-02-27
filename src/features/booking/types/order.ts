// Types cho Order

export interface OrderDetail {
  id: number;
  seatId: number;
  seatCode: string;
  price: number;
  originalPrice: number;
  qr: string | null;
  // Thông tin loại vé (optional, phụ thuộc API)
  ticketTypeId?: number | null;
  ticketTypeName?: string | null;
}

export interface Order {
  id: number;
  code: string;
  totalAmount: number;
  totalQuantity: number;
  status: "UNPAID" | "PAID" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  recipientAddress: string;
  paymentAt: string | null;
  payosCode: number | null;
  orderDetails: OrderDetail[];
}

export interface TicketOrderItem {
  ticketTypeId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  recipientAddress: string;
  seatIds?: number[];
  ticketItems?: TicketOrderItem[];
  ticketTypeId?: number;
  quantity?: number;
}

export interface CheckoutRequest {
  orderId: number;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export interface CheckoutResponse {
  code: number;
  message: string; // URL thanh toán
}
