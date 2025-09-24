// GeminiClient.ts
import { GeminiPrompt, GeminiResponse } from './types';
import { GEMINI_API_URL, GEMINI_API_KEY } from './config';

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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data: GeminiResponse = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}