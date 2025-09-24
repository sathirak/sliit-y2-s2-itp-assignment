import React, { useState } from 'react';
import { sendGeminiPrompt } from './GeminiClient';

export default function GeminiChat() {
	const [prompt, setPrompt] = useState('');
	const [response, setResponse] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSend = async () => {
		if (!prompt.trim()) return;
		setLoading(true);
		setError('');
		setResponse('');
		try {
			const result = await sendGeminiPrompt(prompt);
			setResponse(result);
		} catch (e: any) {
			setError(e.message || 'Error');
		}
		setLoading(false);
	};

	return (
		<div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
			<h2 className="text-xl font-bold mb-4"> AI Chat</h2>
			<div className="mb-4">
				<textarea
					className="w-full border rounded p-2"
					rows={3}
					value={prompt}
					onChange={e => setPrompt(e.target.value)}
					placeholder="Type your prompt here..."
					disabled={loading}
				/>
			</div>
			<button
				className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
				onClick={handleSend}
				disabled={loading || !prompt.trim()}
			>
				{loading ? 'Sending...' : 'Send'}
			</button>
			{error && <div className="mt-4 text-red-600">Error: {error}</div>}
			{response && (
				<div className="mt-4 p-4 bg-gray-100 rounded">
					<strong> Response:</strong>
					<div className="mt-2 whitespace-pre-line">{response}</div>
				</div>
			)}
		</div>
	);
}
