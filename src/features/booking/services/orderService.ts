import apiClient from "@/lib/axios";
import type {
  Order,
  CreateOrderRequest,
  CheckoutRequest,
  ApiResponse,
  CheckoutResponse
} from "../types/order";

export const orderService = {
  // Tạo đơn hàng mới
  createOrder: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    const res: any = await apiClient.post("/orders", data);
    return res?.data || res;
  },

  // Lấy URL thanh toán
  checkout: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    const res: any = await apiClient.post("/orders/checkout", data);
    return res?.data || res;
  },

  // Lấy danh sách đơn hàng của tôi
  getMyOrders: async (): Promise<ApiResponse<Order[]>> => {
    const res: any = await apiClient.get("/orders/my-orders");
    return res?.data || res;
  },

  // Lấy chi tiết một đơn hàng theo ID
  getOrderById: async (orderId: number): Promise<ApiResponse<Order>> => {
    const res: any = await apiClient.get(`/orders/${orderId}`);
    return res?.data || res;
  },

  // Check-in vé bằng token
  checkIn: async (token: string): Promise<ApiResponse<{ message: string }>> => {
    const res: any = await apiClient.post(`/orders/check-in?token=${token}`);
    return res?.data || res;
  },
};
