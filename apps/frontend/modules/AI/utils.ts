// utils.ts
export function formatGeminiResponse(text: string): string {
  return text.trim().replace(/\n\n/g, '\n');
}
export function getGeminiErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'Unknown error';
}