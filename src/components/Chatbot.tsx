import React, { useState } from 'react';
import { MessageCircle, Sparkles, X } from 'lucide-react';

const Chatbot = () => {
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState([
		{ sender: 'bot', text: 'Hi! I am SMAK Chatbot. How can I help you?' }
	]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);

	const sendMessage = async () => {
		if (!input.trim()) return;
		setMessages([...messages, { sender: 'user', text: input }]);
		setLoading(true);
		try {
			const res = await fetch('https://smak-server.vercel.app/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt: input })
			});
			const data = await res.json();
			const reply = data?.response || 'Sorry, I could not get a response.';
			setMessages(msgs => [...msgs, { sender: 'bot', text: reply }]);
		} catch (e) {
			setMessages(msgs => [...msgs, { sender: 'bot', text: 'Error connecting to local chatbot.' }]);
		}
		setInput('');
		setLoading(false);
	};

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
			{!open && (
				<button
					onClick={() => setOpen(true)}
					className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none"
					title="Chat with SMAK Chatbot"
				>
					<MessageCircle className="h-6 w-6" />
				</button>
			)}
			{open && (
				<div className="w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-blue-200 dark:border-slate-700 flex flex-col overflow-hidden animate-fade-in">
					<div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
						<div className="flex items-center space-x-2">
							<Sparkles className="h-5 w-5" />
							<span className="font-bold">SMAK Chatbot</span>
						</div>
						<button onClick={() => setOpen(false)} className="hover:bg-blue-700 rounded-full p-1">
							<X className="h-5 w-5" />
						</button>
					</div>
					<div className="flex-1 px-4 py-3 space-y-2 overflow-y-auto max-h-80 bg-slate-50 dark:bg-slate-900">
						{messages.map((msg, idx) => (
							<div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
								<div className={`px-3 py-2 rounded-lg text-sm max-w-[70%] ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-blue-100 dark:border-slate-700'}`}>
									{msg.text}
								</div>
							</div>
						))}
						{loading && (
							<div className="flex justify-start"><div className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white border border-blue-100 dark:border-slate-700">Thinking...</div></div>
						)}
					</div>
					<div className="px-4 py-3 bg-white dark:bg-slate-800 border-t border-blue-100 dark:border-slate-700 flex items-center space-x-2">
						<input
							type="text"
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
							placeholder="Type your message..."
							className="flex-1 px-3 py-2 rounded-lg border border-blue-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
							disabled={loading}
						/>
						<button
							onClick={sendMessage}
							className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold"
							disabled={loading}
						>
							Send
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Chatbot;
