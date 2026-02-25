import apiClient from "@/lib/axios";

// 1. Định nghĩa các Sub-Interfaces (dựa trên JSON bạn gửi)
export interface EventFile {
  id: number;
  originUrl: string;
  thumbUrl: string | null;
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
  quantity: number;
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

// Event status constants
export const EVENT_STATUS = {
  APPROVED: 0,
  NOT_APPROVED: 1,
  PENDING: 2,
} as const;

export type EventStatus = typeof EVENT_STATUS[keyof typeof EVENT_STATUS];

// 2. Định nghĩa Interface chính cho Event
export interface Event {
  id: number;
  title: string;
  venue: string;
  address: string;
  description: string;
  status?: EventStatus; // 0=approved, 1=not approved, 2=pending
  categoryId: number;
  categoryName: string;
  files: EventFile[];
  showings: Showing[];
  youtubeUrl?: string; // Optional YouTube URL field
  deleted?: boolean; // Soft delete flag
}

// 3. Service gọi API
export const eventService = {
  getAll: async (): Promise<Event[]> => {
    const res: any = await apiClient.get("/events");
    // Handle wrapped response { code, data: [...], message }
    return res?.data || res;
  },

  // THÊM HÀM NÀY:
  getById: async (id: string | number): Promise<Event> => {
    const res: any = await apiClient.get(`/events/${id}`);
    return res?.data || res;
  },

  // Lấy danh sách events theo category
  getByCategory: async (categoryId: string | number): Promise<Event[]> => {
    const res: any = await apiClient.get(`/events/category/${categoryId}`);
    return res?.data || res;
  },

  // Lấy danh sách lịch diễn theo Event ID
  getShowingsByEventId: async (eventId: string | number): Promise<Showing[]> => {
    const response: any = await apiClient.get<any, any>(`/showings/event/${eventId}`);
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

  // Lấy danh sách loại vé theo Showing ID
  getTicketTypesByShowingId: async (showingId: string | number): Promise<TicketType[]> => {
    const response: any = await apiClient.get<any, any>(`/ticket-types/showing/${showingId}`);
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

  // Tìm kiếm sự kiện theo keyword
  search: async (keyword: string): Promise<Event[]> => {
    const res: any = await apiClient.get(`/events/search?keyword=${encodeURIComponent(keyword)}`);
    return res?.data || res;
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

  // API Xóa mềm Suất diễn
  softDeleteShowing: async (id: number): Promise<Showing> => {
    console.log("EventService - Soft deleting showing with id:", id);
    const payload = {
      id,
      deleted: "true"
    };
    const response = await apiClient.put("/showings", payload);
    console.log("EventService - SoftDeleteShowing API raw response:", response);
    // Due to interceptor returning response.data, we need to handle both direct and wrapped formats
    if (response && typeof response === 'object' && 'id' in response) {
      console.log("EventService - SoftDeleteShowing API returned direct response:", response);
      return response as unknown as Showing; // Direct response (already processed by interceptor)
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      console.log("EventService - SoftDeleteShowing API returned wrapped response:", response.data);
      return response.data as unknown as Showing; // Wrapped response (processed by interceptor)
    } else {
      // Fallback to response if it looks like a valid Showing object
      if (response && typeof response === 'object' && 'id' in response) {
        console.log("EventService - SoftDeleteShowing API returned valid showing object:", response);
        return response as unknown as Showing;
      }
      console.error("EventService - SoftDeleteShowing API returned invalid response:", response);
      throw new Error('Invalid response format from server when soft deleting showing');
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

  // API Cập nhật Loại vé
  updateTicketType: async (payload: any): Promise<TicketType> => {
    console.log("EventService - Updating ticket type with payload:", payload);
    const response = await apiClient.put("/ticket-types", payload);
    console.log("EventService - UpdateTicketType API raw response:", response);
    // Due to interceptor returning response.data, we need to handle both direct and wrapped formats
    if (response && typeof response === 'object' && 'id' in response) {
      console.log("EventService - UpdateTicketType API returned direct response:", response);
      return response as unknown as TicketType; // Direct response (already processed by interceptor)
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      console.log("EventService - UpdateTicketType API returned wrapped response:", response.data);
      return response.data as unknown as TicketType; // Wrapped response (processed by interceptor)
    } else {
      // Fallback to response if it looks like a valid TicketType object
      if (response && typeof response === 'object' && 'id' in response) {
        console.log("EventService - UpdateTicketType API returned valid ticket type object:", response);
        return response as unknown as TicketType;
      }
      console.error("EventService - UpdateTicketType API returned invalid response:", response);
      throw new Error('Invalid response format from server when updating ticket type');
    }
  },

  // API Ẩn Loại vé (xóa mềm)
  hideTicketType: async (id: number): Promise<TicketType> => {
    console.log("EventService - Hiding ticket type with id:", id);
    const payload = {
      id,
      status: 0 // 0: ẩn ticket đi (xóa mềm)
    };
    const response = await apiClient.put("/ticket-types", payload);
    console.log("EventService - HideTicketType API raw response:", response);
    // Due to interceptor returning response.data, we need to handle both direct and wrapped formats
    if (response && typeof response === 'object' && 'id' in response) {
      console.log("EventService - HideTicketType API returned direct response:", response);
      return response as unknown as TicketType; // Direct response (already processed by interceptor)
    } else if (response && typeof response === 'object' && 'data' in response && response.data && typeof response.data === 'object' && 'id' in response.data) {
      console.log("EventService - HideTicketType API returned wrapped response:", response.data);
      return response.data as unknown as TicketType; // Wrapped response (processed by interceptor)
    } else {
      // Fallback to response if it looks like a valid TicketType object
      if (response && typeof response === 'object' && 'id' in response) {
        console.log("EventService - HideTicketType API returned valid ticket type object:", response);
        return response as unknown as TicketType;
      }
      console.error("EventService - HideTicketType API returned invalid response:", response);
      throw new Error('Invalid response format from server when hiding ticket type');
    }
  },

  // API lấy danh sách sự kiện cho admin (bao gồm status & deleted)
  getAdminEvents: async (): Promise<Event[]> => {
    const res: any = await apiClient.get("/events/admin");
    return res?.data || res;
  },

  // API duyệt sự kiện (chỉ super_admin)
  approveEvent: async (eventId: number): Promise<Event> => {
    const res: any = await apiClient.put(`/events/${eventId}/approve`);
    return res?.data || res;
  },

  // API không duyệt sự kiện (chỉ super_admin)
  notApproveEvent: async (eventId: number): Promise<Event> => {
    const res: any = await apiClient.put(`/events/${eventId}/not-approve`);
    return res?.data || res;
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
