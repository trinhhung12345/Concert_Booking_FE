import apiClient from "@/lib/axios";
import type { SeatMapData } from "../types/seatmap";

export const bookingService = {
  // Lấy chi tiết sơ đồ ghế theo ID
  getSeatMapById: async (id: number | string): Promise<SeatMapData> => {
    return apiClient.get(`/seat-maps/${id}`) as Promise<SeatMapData>;
  },

  // Lấy danh sách sơ đồ ghế theo eventId
  getSeatMapsByEventId: async (eventId: number | string): Promise<SeatMapData[]> => {
    return apiClient.get(`/seat-maps`, {
      params: { eventId },
    }) as Promise<SeatMapData[]>;
  },

  // Lấy danh sách sơ đồ ghế theo showingId (mới cập nhật)
  getSeatMapsByShowingId: async (showingId: number | string): Promise<SeatMapData[]> => {
    return apiClient.get(`/seat-maps`, {
      params: { showingId },
    }) as Promise<SeatMapData[]>;
  },

  // Lấy sơ đồ ghế theo showingId (trả về một seat map cụ thể)
  getSeatMapByShowingId: async (showingId: number | string): Promise<SeatMapData | undefined> => {
    const seatMaps = await bookingService.getSeatMapsByShowingId(showingId);
    // Trả về seat map đầu tiên nếu có nhiều
    return seatMaps.length > 0 ? seatMaps[0] : undefined;
  },
};
