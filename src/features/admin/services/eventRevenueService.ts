import apiClient from "@/lib/axios";

export interface EventOrderDetail {
  id: number;
  seatId: number;
  seatCode: string;
  price: number;
  originalPrice: number;
  qr: string;
}

export interface EventRevenueOrder {
  id: number;
  code: string;
  totalAmount: number;
  totalQuantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  recipientAddress: string;
  paymentAt: string;
  payosCode: number;
  orderDetails: EventOrderDetail[];
}

export interface EventRevenueData {
  eventId: number;
  eventTitle: string;
  revenue: number;
  orders: EventRevenueOrder[];
}

export const eventRevenueService = {
  getEventRevenue: async (eventId: string | number): Promise<EventRevenueData> => {
    const response: any = await apiClient.get(`/events/${eventId}/revenue`);
    const data = response?.data || response;

    return {
      eventId: data?.eventId || Number(eventId) || 0,
      eventTitle: data?.eventTitle || "",
      revenue: data?.revenue || 0,
      orders: Array.isArray(data?.orders) ? data.orders : [],
    };
  },
};
