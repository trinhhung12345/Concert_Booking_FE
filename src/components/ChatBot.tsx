import React, { useState } from 'react';
import { chatWithBot } from '../features/concerts/services/chatbotService';
import type { ChatbotResponse, Option } from '../features/concerts/types/chatbot';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from './ui/dialog';

interface Message {
	sender: 'user' | 'bot';
	text: string;
	options?: Option[];
}

interface FormField {
	name: string;
	label: string;
	type: string;
	required: boolean;
	placeholder?: string;
	options?: Array<{ label: string; value: string | number }>;
}

const ChatBot: React.FC = () => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);

	const [activeForm, setActiveForm] = useState<FormField[] | null>(null);
	const [formData, setFormData] = useState<Record<string, string>>({});

	const sendMessage = async (msg: string) => {
		setMessages(prev => [...prev, { sender: 'user', text: msg }]);
		setLoading(true);

		try {
			const res: ChatbotResponse = await chatWithBot({ message: msg });

			setMessages(prev => [
				...prev,
				{ sender: 'bot', text: res.reply, options: res.options },
			]);

			if (res.formFields && res.formFields.length > 0) {
				// Đảm bảo required luôn là boolean
				setActiveForm(res.formFields.map(f => ({
					...f,
					required: f.required === true // true nếu true, còn lại là false
				})));
				setFormData({});
			}
		} catch {
			setMessages(prev => [
				...prev,
				{ sender: 'bot', text: 'Có lỗi xảy ra.' },
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
		sendMessage(option.label);
	};

	const submitForm = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res: ChatbotResponse = await chatWithBot({
				message: '',
				recipient: formData,
			} as any);

			setMessages(prev => [
				...prev,
				{ sender: 'bot', text: res.reply },
			]);

			setActiveForm(null);
			setFormData({});
		} catch {
			setMessages(prev => [
				...prev,
				{ sender: 'bot', text: 'Gửi thông tin thất bại.' },
			]);
		}

		setLoading(false);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="fixed right-4 bottom-6 z-50 h-12 w-12 rounded-full bg-primary text-white">
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
							<div className="inline-block px-3 py-2 rounded-2xl bg-muted">
								{msg.text}
							</div>

							{msg.options && (
								<div className="flex flex-wrap gap-2 mt-2">
									{msg.options.map((opt, i) => (
										<button
											key={i}
											className="px-3 py-1 bg-primary text-white rounded-md"
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

				{activeForm ? (
					<form onSubmit={submitForm} className="flex flex-col gap-2">
						{activeForm.map(f => (
							<input
								key={f.name}
								required={f.required}
								placeholder={f.label}
								value={formData[f.name] || ''}
								onChange={e =>
									setFormData(prev => ({
										...prev,
										[f.name]: e.target.value,
									}))
								}
								className="border rounded-lg px-3 py-2"
							/>
						))}
						<button
							type="submit"
							className="bg-primary text-white py-2 rounded-lg"
							disabled={loading}
						>
							Gửi thông tin
						</button>
					</form>
				) : (
					<form onSubmit={handleSend} className="flex gap-2">
						<input
							className="flex-1 border rounded-xl px-3 py-2"
							value={input}
							onChange={e => setInput(e.target.value)}
							placeholder="Nhập tin nhắn..."
							disabled={loading}
						/>
						<button
							type="submit"
							className="bg-primary text-white px-4 py-2 rounded-xl"
							disabled={loading}
						>
							Gửi
						</button>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default ChatBot;
