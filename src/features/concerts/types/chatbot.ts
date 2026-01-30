// Các type cho Chatbot FE

export interface ChatbotRequest {
  message: string;
}

export interface ChatbotResponse {
  reply: string;
  intent: 'search_event' | 'book_ticket' | 'greeting' | 'help' | 'unknown';
  options?: Option[];
  formFields?: Array<{
    name: string;
    label: string;
    type: string;
    required?: boolean;
    placeholder?: string;
    options?: Array<{ label: string; value: string | number }>;
  }>;
}

export interface Option {
  label: string;
  value: string | number;
  actionUrl?: string;
}

// BookingContext lưu trạng thái booking của user
export interface BookingContext {
  eventId?: number;
  showingId?: number;
  sectionId?: number;
  seatCount?: number;
  seatIds?: number[];
  recipientName?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  recipientAddress?: string;
}
