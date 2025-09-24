import React, { useState } from 'react';
import { sendGeminiPrompt } from './GeminiClient';
import { formatGeminiResponse, getGeminiErrorMessage } from './utils';

export default function GeminiPromt() {
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
			setResponse(formatGeminiResponse(result));
		} catch (e) {
			setError(getGeminiErrorMessage(e));
		}
		setLoading(false);
	};

	return (
		<div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
			<h2 className="text-lg font-bold mb-4">Gemini Prompt</h2>
			<div className="mb-4">
				<input
					className="w-full border rounded p-2"
					type="text"
					value={prompt}
					onChange={e => setPrompt(e.target.value)}
					placeholder="Enter your prompt..."
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
					<strong>Gemini Response:</strong>
					<div className="mt-2 whitespace-pre-line">{response}</div>
				</div>
			)}
		</div>
	);
}
