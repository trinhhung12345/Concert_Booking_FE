import apiClient from "@/lib/axios";
import type { SeatMapData } from "../types/seatmap";

export const bookingService = {
  // Lấy chi tiết sơ đồ ghế theo ID
  getSeatMapById: async (id: number | string): Promise<SeatMapData> => {
    const res: any = await apiClient.get(`/seat-maps/${id}`);
    return res?.data || res;
  },

  // Lấy danh sách sơ đồ ghế theo eventId
  getSeatMapsByEventId: async (eventId: number | string): Promise<SeatMapData[]> => {
    const res: any = await apiClient.get(`/seat-maps`, {
      params: { eventId },
    });
    return res?.data || res;
  },

  // Lấy danh sách sơ đồ ghế theo showingId (mới cập nhật)
  getSeatMapsByShowingId: async (showingId: number | string): Promise<SeatMapData[]> => {
    const res: any = await apiClient.get(`/seat-maps`, {
      params: { showingId },
    });
    return res?.data || res;
  },

  // Lấy sơ đồ ghế theo showingId (trả về một seat map cụ thể)
  getSeatMapByShowingId: async (showingId: number | string): Promise<SeatMapData | undefined> => {
    const seatMaps = await bookingService.getSeatMapsByShowingId(showingId);
    // Trả về seat map đầu tiên nếu có nhiều
    return seatMaps.length > 0 ? seatMaps[0] : undefined;
  },

  // Lấy sơ đồ ghế theo showingId từ API mới (v1)
  getSeatMapByShowingIdV1: async (showingId: number | string): Promise<SeatMapData[]> => {
    const response: any = await apiClient.get<any, any>(`/seat-maps/showings/${showingId}`);
    // Handle wrapped response { code: 200, data: [...], message: "..."}
    if (response?.data && Array.isArray(response.data)) {
        return response.data;
    }
    // Handle direct array response [...]
    if (Array.isArray(response)) {
        return response;
    }
    return [];
  },
};
