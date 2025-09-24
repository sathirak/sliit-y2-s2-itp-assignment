import React, { useState } from 'react';
import { sendGeminiPrompt } from './GeminiClient';

export default function GeminiChat() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setError(''); setResponse('');
    try {
      const result = await sendGeminiPrompt(prompt);
      setResponse(result);
    } catch (e: any) {
      setError(e.message || 'Error');
    }
    setLoading(false);
  };
  return (
    <div>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} />
      <button onClick={handleSend} disabled={loading || !prompt.trim()}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {response && <div>Response: {response}</div>}
    </div>
  );
}