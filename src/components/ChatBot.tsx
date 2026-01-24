import React, { useState } from 'react';
import { chatWithBot } from '../features/concerts/services/chatbotService';
import type { ChatbotResponse, Option } from '../features/concerts/types/chatbot';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from './ui/dialog';

interface Message {
	sender: 'user' | 'bot';
	text: string;
	options?: Option[];
}

const ChatBot: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);

	const sendMessage = async (msg: string) => {
		setMessages(prev => [...prev, { sender: 'user', text: msg }]);
		setLoading(true);
		try {
			const res: ChatbotResponse | undefined = await chatWithBot({ message: msg });
			const reply = res?.reply ?? 'Không nhận được phản hồi từ server.';
			const options = res?.options;
			setMessages(prev => [
				...prev,
				{ sender: 'bot', text: reply, options }
			]);
		} catch (err) {
			setMessages(prev => [
				...prev,
				{ sender: 'bot', text: 'Có lỗi xảy ra, vui lòng thử lại.' }
			]);
		}
		setLoading(false);
	};

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;
		sendMessage(input.trim());
		setInput('');
	};

	const handleOptionClick = (option: Option) => {
		// Nếu có actionUrl, có thể gọi API hoặc chuyển bước
		sendMessage(option.label);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button
					aria-label="Open chat"
					className="fixed right-4 bottom-6 z-50 h-12 w-12 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90"
				>
					💬
				</button>
			</DialogTrigger>

			<DialogContent className="w-full max-w-sm p-4">
				<DialogHeader>
					<DialogTitle>Chat hỗ trợ</DialogTitle>
				</DialogHeader>

				<div className="h-64 overflow-y-auto mb-3 flex flex-col gap-3">
					{messages.map((msg, idx) => (
						<div key={idx} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
							<div className={msg.sender === 'user' ? 'bg-primary text-white inline-block px-3 py-2 rounded-2xl' : 'bg-popover text-popover-foreground inline-block px-3 py-2 rounded-2xl'}>
								{msg.text}
							</div>
							{msg.options && (
								<div className="flex flex-wrap gap-2 mt-2">
									{msg.options.map((opt, i) => (
										<button
											key={i}
											className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90"
											onClick={() => handleOptionClick(opt)}
										>
											{opt.label}
										</button>
									))}
								</div>
							)}
						</div>
					))}
					{loading && <div className="text-gray-400">Đang trả lời...</div>}
				</div>

				<form onSubmit={handleSend} className="flex gap-2">
					<input
						className="flex-1 border border-input rounded-xl px-3 py-2 bg-transparent text-sm"
						value={input}
						onChange={e => setInput(e.target.value)}
						placeholder="Nhập tin nhắn..."
						disabled={loading}
					/>
					<button type="submit" className="bg-primary text-white px-4 py-2 rounded-xl shadow-lg shadow-primary/20 text-sm" disabled={loading}>
						Gửi
					</button>
				</form>

        
			</DialogContent>
		</Dialog>
	);
};

export default ChatBot;
