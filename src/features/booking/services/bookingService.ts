import apiClient from "@/lib/axios";
import type { SeatMapData } from "../types/seatmap";

export const bookingService = {
  // Lấy chi tiết sơ đồ ghế theo ID
  getSeatMapById: async (id: number | string): Promise<SeatMapData> => {
    return apiClient.get(`/seat-maps/${id}`) as Promise<SeatMapData>;
  },
};
