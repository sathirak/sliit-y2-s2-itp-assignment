# AI Module: Gemini Integration

This folder contains all code for integrating Google Gemini AI (gemini-2.5-flash-lite) into your project.

## Files and Purpose

- `GeminiClient.ts` — Handles API requests to Gemini, provides `sendGeminiPrompt(prompt)` function.
- `GeminiChat.tsx` — React component for chat-style interaction with Gemini.
- `GeminiPromt.tsx` — React component for single-prompt Q&A with Gemini.
- `types.ts` — Shared TypeScript types/interfaces for Gemini requests and responses.
- `utils.ts` — Utility functions for formatting responses and error handling.
- `config.ts` — (Optional) For advanced config or API key management.
- `README.md` — This documentation file.

## Setup Instructions

1. **API Key:**
	- Add your Gemini API key to `.env` as:
	  ```
	  NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
	  ```

2. **Install dependencies:**
	- Run `pnpm install` in your project root if you haven't already.

3. **Usage:**
	- Import and use `<GeminiChat />` or `<GeminiPromt />` in your pages/components.
	- Use `sendGeminiPrompt(prompt)` directly for custom integrations.

## Example Usage

```
import GeminiChat from '@/modules/AI/GeminiChat';

export default function MyPage() {
  return <GeminiChat />;
}
```

## Notes

- Never commit your real API key to public repositories.
- You can extend the UI, add streaming, or customize prompt handling as needed.

---
For more details, see [Gemini API docs](https://ai.google.dev/gemini-api/docs/models#gemini-2.5-flash-lite)
