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
    return apiClient.post("/orders", data) as Promise<ApiResponse<Order>>;
  },

  // Lấy URL thanh toán
  checkout: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    return apiClient.post("/orders/checkout", data) as Promise<CheckoutResponse>;
  },

  // Lấy danh sách đơn hàng của tôi
  getMyOrders: async (): Promise<ApiResponse<Order[]>> => {
    return apiClient.get("/orders/my-orders") as Promise<ApiResponse<Order[]>>;
  },

  // Lấy chi tiết một đơn hàng theo ID
  getOrderById: async (orderId: number): Promise<ApiResponse<Order>> => {
    return apiClient.get(`/orders/${orderId}`) as Promise<ApiResponse<Order>>;
  },
};
