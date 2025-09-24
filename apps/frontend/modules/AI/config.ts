// config.ts - Gemini AI configuration

export const GEMINI_API_URL =
	process.env.NEXT_PUBLIC_GEMINI_API_URL ||
	'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

export const GEMINI_MODEL = 'gemini-2.5-flash-lite';

export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
