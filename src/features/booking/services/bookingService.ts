import apiClient from "@/lib/axios";
import type { SeatMapData } from "../types/seatmap";

export const bookingService = {
  // Lấy chi tiết sơ đồ ghế theo ID
  getSeatMapById: async (id: number | string): Promise<SeatMapData> => {
    return apiClient.get(`/seat-maps/${id}`) as Promise<SeatMapData>;
  },

  // Lấy danh sách sơ đồ ghế theo eventId (showing)
  getSeatMapsByEventId: async (eventId: number | string): Promise<SeatMapData[]> => {
    return apiClient.get(`/seat-maps`, {
      params: { eventId },
    }) as Promise<SeatMapData[]>;
  },

  // Lấy sơ đồ ghế theo showingId
  getSeatMapByShowingId: async (eventId: number | string, showingId: number | string): Promise<SeatMapData | undefined> => {
    const seatMaps = await bookingService.getSeatMapsByEventId(eventId);
    return seatMaps.find((seatMap) => seatMap.showingId === Number(showingId));
  },
};
