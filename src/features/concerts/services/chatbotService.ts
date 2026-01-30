import axios from '../../../lib/axios';
import type { ChatbotRequest, ChatbotResponse } from '../types/chatbot';

export async function chatWithBot(
	request: ChatbotRequest
): Promise<ChatbotResponse> {
	const res = await axios.post<ChatbotResponse>(
		'chatbot/message',
		request
	);
	return (res as any).data ?? res;
}
