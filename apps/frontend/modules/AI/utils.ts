// utils.ts - Gemini AI utilities

/**
 * Format Gemini response text for display (e.g., trim, handle markdown)
 */
export function formatGeminiResponse(text: string): string {
	// Simple formatting: trim and replace double newlines with <br/>
	return text.trim().replace(/\n\n/g, '\n');
}

/**
 * Extract error message from Gemini API error
 */
export function getGeminiErrorMessage(error: unknown): string {
	if (typeof error === 'string') return error;
	if (error instanceof Error) return error.message;
	return 'Unknown error';
}
