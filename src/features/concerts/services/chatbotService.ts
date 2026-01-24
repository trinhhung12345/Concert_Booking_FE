import axios from '../../../lib/axios';
import type { ChatbotRequest, ChatbotResponse } from '../types/chatbot';

// Gửi message lên chatbot API
export async function chatWithBot(request: ChatbotRequest): Promise<ChatbotResponse> {
	// Note: `apiClient` may unwrap response.data in an interceptor, or return an AxiosResponse.
	// Handle both cases: prefer `.data` when present, otherwise use the returned value.
	const res = await axios.post<ChatbotResponse>('chatbot/message', request);
	const data = (res as any)?.data ?? res;
	return data as ChatbotResponse;
}

// Có thể mở rộng thêm các hàm cho các intent khác nếu cần
