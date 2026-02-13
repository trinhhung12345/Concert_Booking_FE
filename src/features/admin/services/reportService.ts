import apiClient from "@/lib/axios";
import type { Event } from "@/features/concerts/services/eventService";

export interface EventsStats {
  total: number;
  upcoming: number;
  completed: number;
  byCategory: { name: string; count: number }[];
  recentEvents: Event[];
}

export const reportService = {
  // Lấy thống kê events cho dashboard
  getEventsStats: async (): Promise<EventsStats> => {
    try {
      const response = await apiClient.get<any>("/events");
      
      // Backend có thể trả về format { code: 200, data: [...], message: "..." } 
      // hoặc mảng trực tiếp [...], cần handle cả 2 trường hợp
      let events: Event[];
      if (Array.isArray(response)) {
        events = response;
      } else if (response.data && Array.isArray(response.data)) {
        events = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        events = response.data.data;
      } else {
        console.warn("Unexpected response format:", response);
        events = [];
      }
      
      console.log("[getEventsStats] Events loaded:", events.length);
      
      const now = new Date();

      // Tính toán thống kê
      const total = events.length;
      
      // Đếm events sắp diễn ra (có showing trong tương lai)
      const upcoming = events.filter((event: Event) => {
        if (!event.showings || event.showings.length === 0) return false;
        return event.showings.some(s => new Date(s.startTime) > now);
      });

      // Đếm events đã kết thúc (tất cả showings đã qua)
      const completed = events.filter((event: Event) => {
        if (!event.showings || event.showings.length === 0) return false;
        return event.showings.every(s => new Date(s.endTime) < now);
      });

      // Đếm theo category
      const categoryMap = new Map<string, number>();
      events.forEach((event: Event) => {
        const catName = event.categoryName || "Khác";
        categoryMap.set(catName, (categoryMap.get(catName) || 0) + 1);
      });
      const byCategory = Array.from(categoryMap.entries()).map(([name, count]) => ({
        name,
        count
      }));

      // Events gần đây (sort theo id giảm dần, lấy 5)
      const recentEvents = [...events]
        .sort((a: Event, b: Event) => b.id - a.id)
        .slice(0, 5);

      return {
        total,
        upcoming: upcoming.length,
        completed: completed.length,
        byCategory,
        recentEvents
      };
    } catch (error) {
      console.error("Error fetching events stats:", error);
      throw error;
    }
  },

  // Lấy revenue stats (placeholder - cần API riêng từ backend)
  getRevenueStats: async (startDate?: string, endDate?: string) => {
    // TODO: Backend cần có API /reports/revenue
    // Hiện tại chưa có endpoint này
    console.warn("Revenue stats API not available - requires backend implementation");
    return { total: 0, byMonth: [], byEvent: [] };
  },

  // Lấy ticket sales stats (placeholder)
  getTicketSalesStats: async () => {
    // TODO: Cần API từ backend
    console.warn("Ticket sales stats API not available");
    return { totalSold: 0, totalAvailable: 0, byType: [] };
  }
};
