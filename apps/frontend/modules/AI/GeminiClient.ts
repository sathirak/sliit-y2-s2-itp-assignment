// GeminiClient.ts
// Connects to Gemini API (gemini-2.5-flash-lite)

export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

// You should store your API key securely (e.g. in .env.local)
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export interface GeminiPrompt {
	contents: Array<{
		role: 'user' | 'model';
		parts: Array<{ text: string }>;
	}>;
}

export interface GeminiResponse {
	candidates: Array<{
		content: {
			parts: Array<{ text: string }>;
		};
	}>;
}

export async function sendGeminiPrompt(prompt: string): Promise<string> {
	if (!GEMINI_API_KEY) throw new Error('Missing Gemini API key');

	const body: GeminiPrompt = {
		contents: [
			{
				role: 'user',
				parts: [{ text: prompt }],
			},
		],
	};

	const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		throw new Error(`Gemini API error: ${res.status}`);
	}

	const data: GeminiResponse = await res.json();
	// Return the first candidate's text
	return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}
