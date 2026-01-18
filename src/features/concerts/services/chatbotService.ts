import apiClient from "@/lib/axios";

// Interface cho response của chatbot
export interface ChatbotMessage {
  message: string;
  userId?: string;
  response?: string;
  timestamp?: string;
}

export interface ChatResponse {
  response: string;
  timestamp?: string;
}

export interface HelpResponse {
  commands: string[];
  examples: string[];
}

export const chatbotService = {
  // Gửi message tới chatbot
  sendMessage: async (message: string, userId?: string): Promise<ChatResponse> => {
    return apiClient.post("/chatbot/chat", {
      message,
      userId: userId || "guest",
    });
  },

  // Lấy danh sách help/commands
  getHelp: async (): Promise<HelpResponse> => {
    return apiClient.get("/chatbot/help");
  },
};
