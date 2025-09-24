// types.ts - Shared Gemini API types

export interface GeminiContentPart {
	text: string;
}

export interface GeminiContent {
	role: 'user' | 'model';
	parts: GeminiContentPart[];
}

export interface GeminiPrompt {
	contents: GeminiContent[];
}

export interface GeminiCandidate {
	content: {
		parts: GeminiContentPart[];
	};
}

export interface GeminiResponse {
	candidates: GeminiCandidate[];
}
