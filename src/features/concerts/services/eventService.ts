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
  },

  // API Tạo sự kiện (FormData)
  create: async (formData: FormData) => {
    console.log("EventService - Creating event with FormData:", Array.from(formData.entries()));
    const response = await apiClient.post("/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("EventService - Create API raw response:", response);
    // Due to interceptor returning response.data, we need to handle both direct and wrapped formats
    if (response && typeof response === 'object' && 'id' in response) {
      console.log("EventService - Create API returned direct response:", response);
      return response as unknown as Event; // Direct response (already processed by interceptor)
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      console.log("EventService - Create API returned wrapped response:", response.data);
      return response.data as unknown as Event; // Wrapped response (processed by interceptor)
    } else {
      // Fallback to response if it looks like a valid Event object
      if (response && typeof response === 'object' && 'id' in response) {
        console.log("EventService - Create API returned valid event-like object:", response);
        return response as unknown as Event;
      }
      console.error("EventService - Create API returned invalid response:", response);
      throw new Error('Invalid response format from server when creating event');
    }
  },

  // API Tạo Suất diễn
 createShowing: async (payload: any): Promise<{ id: number }> => {
    console.log("EventService - Creating showing with payload:", payload);
    const response = await apiClient.post("/showings", payload);
    console.log("EventService - CreateShowing API raw response:", response);
    // Due to interceptor returning response.data, we need to handle both direct and wrapped formats
    if (response && typeof response === 'object' && 'id' in response) {
      console.log("EventService - CreateShowing API returned direct response:", response);
      return response as unknown as { id: number }; // Direct response (already processed by interceptor)
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      console.log("EventService - CreateShowing API returned wrapped response:", response.data);
      return response.data as unknown as { id: number }; // Wrapped response (processed by interceptor)
    } else {
      // Fallback to response if it looks like a valid object with id
      if (response && typeof response === 'object' && 'id' in response) {
        console.log("EventService - CreateShowing API returned valid object:", response);
        return response as unknown as { id: number };
      }
      console.error("EventService - CreateShowing API returned invalid response:", response);
      throw new Error('Invalid response format from server when creating showing');
    }
  },

  // API Cập nhật Suất diễn
  updateShowing: async (payload: Partial<Showing>): Promise<Showing> => {
    console.log("EventService - Updating showing with payload:", payload);
    const response = await apiClient.put("/showings", payload);
    console.log("EventService - UpdateShowing API raw response:", response);
    // Due to interceptor returning response.data, we need to handle both direct and wrapped formats
    if (response && typeof response === 'object' && 'id' in response) {
      console.log("EventService - UpdateShowing API returned direct response:", response);
      return response as unknown as Showing; // Direct response (already processed by interceptor)
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      console.log("EventService - UpdateShowing API returned wrapped response:", response.data);
      return response.data as unknown as Showing; // Wrapped response (processed by interceptor)
    } else {
      // Fallback to response if it looks like a valid Showing object
      if (response && typeof response === 'object' && 'id' in response) {
        console.log("EventService - UpdateShowing API returned valid showing object:", response);
        return response as unknown as Showing;
      }
      console.error("EventService - UpdateShowing API returned invalid response:", response);
      throw new Error('Invalid response format from server when updating showing');
    }
  },

  // API Tạo Loại vé
  createTicketType: async (payload: any): Promise<{ id: number }> => {
    console.log("EventService - Creating ticket type with payload:", payload);
    const response = await apiClient.post("/ticket-types", payload);
    console.log("EventService - CreateTicketType API raw response:", response);
    // Due to interceptor returning response.data, we need to handle both direct and wrapped formats
    if (response && typeof response === 'object' && 'id' in response) {
      console.log("EventService - CreateTicketType API returned direct response:", response);
      return response as unknown as { id: number }; // Direct response (already processed by interceptor)
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      console.log("EventService - CreateTicketType API returned wrapped response:", response.data);
      return response.data as unknown as { id: number }; // Wrapped response (processed by interceptor)
    } else {
      // Fallback to response if it looks like a valid object with id
      if (response && typeof response === 'object' && 'id' in response) {
        console.log("EventService - CreateTicketType API returned valid object:", response);
        return response as unknown as { id: number };
      }
      console.error("EventService - CreateTicketType API returned invalid response:", response);
      throw new Error('Invalid response format from server when creating ticket type');
    }
  },

  // API Cập nhật sự kiện (FormData)
  update: async (formData: FormData) => {
    console.log("EventService - Updating event with FormData:", Array.from(formData.entries()));
    const response = await apiClient.put("/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("EventService - Update API raw response:", response);
    // Due to interceptor returning response.data, we need to handle both direct and wrapped formats
    if (response && typeof response === 'object' && 'id' in response) {
      console.log("EventService - Update API returned direct response:", response);
      return response as unknown as Event; // Direct response (already processed by interceptor)
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      console.log("EventService - Update API returned wrapped response:", response.data);
      return response.data as unknown as Event; // Wrapped response (processed by interceptor)
    } else {
      // Fallback to response if it looks like a valid Event object
      if (response && typeof response === 'object' && 'id' in response) {
        console.log("EventService - Update API returned valid event-like object:", response);
        return response as unknown as Event;
      }
      console.error("EventService - Update API returned invalid response:", response);
      throw new Error('Invalid response format from server when updating event');
    }
  },
};
