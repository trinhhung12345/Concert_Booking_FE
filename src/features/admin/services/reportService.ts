import apiClient from "@/lib/axios";
import type { Event } from "@/features/concerts/services/eventService";

export interface EventsStats {
  total: number;
  upcoming: number;
  completed: number;
  byCategory: { name: string; count: number }[];
  recentEvents: Event[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalTicketsSold: number;
  totalEvents: number;
  newUsers: number;
  revenueGrowth: number | null;
}

export interface RevenueChartData {
  name: string;
  revenue: number;
  tickets: number;
}

export interface CategoryStats {
  name: string;
  value: number;
  color: string;
}

export interface RecentOrder {
  id: number;
  customerName: string;
  eventName: string;
  date: string;
  amount: number;
  status: string;
}

export interface TopEvent {
  id: number;
  title: string;
  date: string;
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  status: string;
}

export const reportService = {
  // Lấy top events từ API
  getTopEvents: async (): Promise<TopEvent[]> => {
    try {
      const response = await apiClient.get<any>("/dashboard/top-events");
      
      // Backend trả về format { code: 200, data: [...], message: "..." }
      if (response.data && Array.isArray(response.data)) {
        return response.data.map((item: any) => ({
          id: item.id || 0,
          title: item.title || "",
          date: item.date || "",
          ticketsSold: item.ticketsSold || 0,
          totalTickets: item.totalTickets || 0,
          revenue: item.revenue || 0,
          status: item.status || "ACTIVE",
        }));
      }
      
      console.warn("Unexpected top events response:", response);
      return [];
    } catch (error) {
      console.error("Error fetching top events:", error);
      throw error;
    }
  },

  // Lấy recent orders từ API
  getRecentOrders: async (): Promise<RecentOrder[]> => {
    try {
      const response = await apiClient.get<any>("/dashboard/recent-orders");
      
      // Backend trả về format { code: 200, data: [...], total_record: 7, current_page: 1 }
      if (response.data && Array.isArray(response.data)) {
        return response.data.map((item: any) => ({
          id: item.id || 0,
          customerName: item.customerName || "",
          eventName: item.eventName || "",
          date: item.date || "",
          amount: item.amount || 0,
          status: item.status || "PENDING",
        }));
      }
      
      console.warn("Unexpected recent orders response:", response);
      return [];
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      throw error;
    }
  },

  // Lấy category stats từ API
  getCategoryStats: async (): Promise<CategoryStats[]> => {
    try {
      const response = await apiClient.get<any>("/dashboard/category-stats");
      
      // Backend trả về format { code: 200, data: [...], message: "..." }
      if (response.data && Array.isArray(response.data)) {
        return response.data.map((item: any) => ({
          name: item.name || "",
          value: item.value || 0,
          color: item.color || "#8884d8",
        }));
      }
      
      console.warn("Unexpected category stats response:", response);
      return [];
    } catch (error) {
      console.error("Error fetching category stats:", error);
      throw error;
    }
  },

  // Lấy revenue chart từ API
  getRevenueChart: async (): Promise<RevenueChartData[]> => {
    try {
      const response = await apiClient.get<any>("/dashboard/revenue-chart");
      
      // Backend trả về format { code: 200, data: [...], message: "..." }
      if (response.data && Array.isArray(response.data)) {
        return response.data.map((item: any) => ({
          name: item.name || "",
          revenue: item.revenue || 0,
          tickets: item.tickets || 0,
        }));
      }
      
      console.warn("Unexpected revenue chart response:", response);
      return [];
    } catch (error) {
      console.error("Error fetching revenue chart:", error);
      throw error;
    }
  },

  // Lấy dashboard stats từ API
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get<any>("/dashboard/stats");
      
      // Backend trả về format { code: 200, data: {...}, message: "..." }
      if (response.data) {
        return {
          totalRevenue: response.data.totalRevenue || 0,
          totalTicketsSold: response.data.totalTicketsSold || 0,
          totalEvents: response.data.totalEvents || 0,
          newUsers: response.data.newUsers || 0,
          revenueGrowth: response.data.revenueGrowth ?? null,
        };
      }
      
      console.warn("Unexpected dashboard stats response:", response);
      return {
        totalRevenue: 0,
        totalTicketsSold: 0,
        totalEvents: 0,
        newUsers: 0,
        revenueGrowth: null,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

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
