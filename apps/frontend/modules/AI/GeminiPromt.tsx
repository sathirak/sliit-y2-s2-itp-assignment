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
    setLoading(true); setError(''); setResponse('');
    try {
      const result = await sendGeminiPrompt(prompt);
      setResponse(formatGeminiResponse(result));
    } catch (e) {
      setError(getGeminiErrorMessage(e));
    }
    setLoading(false);
  };
  return (
    <div>
      <input type='text' value={prompt} onChange={e => setPrompt(e.target.value)} />
      <button onClick={handleSend} disabled={loading || !prompt.trim()}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {response && <div>Response: {response}</div>}
    </div>
  );
}