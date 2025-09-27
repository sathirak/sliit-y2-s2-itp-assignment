"use client";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY
});
const googleAI = google('gemini-2.5-pro');

const SYSTEM_PROMPT = `
You are an AI shopping assistant for CrownUp Clothing Store. Be friendly, concise, and helpful.
Your main goals are to:
1. Help customers find the right products
2. Answer questions about sizing, shipping, returns, and payments
3. Provide fashion advice and recommendations
4. Guide customers through the ordering process

Keep responses under 3 sentences unless more detail is specifically requested.
Always maintain a friendly, professional tone.
`;

export class AIService {
  static async generateResponse(userMessage: string): Promise<string> {
    try {
      const { text } = await generateText({
        model: googleAI,
        system: SYSTEM_PROMPT,
        prompt: userMessage,
        providerOptions: {
          google: {
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_LOW_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_LOW_AND_ABOVE',
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_LOW_AND_ABOVE',
              },
            ],
          },
        },
      });

      return text;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm having trouble connecting right now. Please try one of the FAQs above or contact our customer service.";
    }
  }
}