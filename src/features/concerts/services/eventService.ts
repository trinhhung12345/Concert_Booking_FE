import apiClient from "@/lib/axios";

// 1. Định nghĩa các Sub-Interfaces (dựa trên JSON bạn gửi)
export interface EventFile {
  id: number;
  originUrl: string;
  thumbUrl: string;
  type: number;
  width: number | null;
  height: number | null;
}

export interface TicketType {
  id: number;
  name: string;
  description: string;
  color: string;
  isFree: boolean;
  price: number;
  originalPrice: number;
  maxQtyPerOrder: number;
  minQtyPerOrder: number;
  startTime: string;
  endTime: string;
  position: number;
  status: string;
  imageUrl: string;
  showingId: number | null;
}

export interface Showing {
  id: number;
  status: string;
  isSalable: boolean;
  startTime: string; // "2026-01-25T01:00:00.000+00:00"
  endTime: string;
  eventId: number;
  types: TicketType[];
}

// 2. Định nghĩa Interface chính cho Event
export interface Event {
  id: number;
  title: string;
  venue: string;
  address: string;
  description: string;
  categoryId: number;
  categoryName: string;
  files: EventFile[];
  showings: Showing[];
  youtubeUrl?: string; // Optional YouTube URL field
}

// 3. Service gọi API
export const eventService = {
  getAll: async (): Promise<Event[]> => {
    // API trả về mảng Event[] trực tiếp (đã được interceptor xử lý)
    return apiClient.get("/events");
  },

  // THÊM HÀM NÀY:
  getById: async (id: string | number): Promise<Event> => {
    return apiClient.get(`/events/${id}`);
  },

  // Lấy danh sách events theo category
  getByCategory: async (categoryId: string | number): Promise<Event[]> => {
    return apiClient.get(`/events/category/${categoryId}`);
  },

  // Lấy danh sách lịch diễn theo Event ID
  getShowingsByEventId: async (eventId: string | number): Promise<Showing[]> => {
    return apiClient.get(`/showings/event/${eventId}`);
  },

  // Lấy danh sách loại vé theo Showing ID
  getTicketTypesByShowingId: async (showingId: string | number): Promise<TicketType[]> => {
    return apiClient.get(`/ticket-types/showing/${showingId}`);
  },

  // Tìm kiếm sự kiện theo keyword
  search: async (keyword: string): Promise<Event[]> => {
    return apiClient.get(`/events/search?keyword=${encodeURIComponent(keyword)}`);
  // API Tạo sự kiện (FormData)
  create: async (formData: FormData) => {
    return apiClient.post<any, Event>("/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // API Tạo Suất diễn
  createShowing: async (payload: any): Promise<{ id: number }> => {
    return apiClient.post("/showings", payload);
  },

  // API Tạo Loại vé
  createTicketType: async (payload: any): Promise<{ id: number }> => {
    return apiClient.post("/ticket-types", payload);
  },
};
