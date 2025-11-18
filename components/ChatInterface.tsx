'use client';
import { useState } from 'react';

export default function ChatInterface({ documentId }: { documentId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, documentId }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      while (true) {
        const { done, value } = (await reader?.read()) || {};
        if (done) break;
        aiResponse += decoder.decode(value);
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: aiResponse },
      ]);
    } catch (error) {
      alert('Chat failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col h-[500px] border border-gray-700 rounded-lg'>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className='max-w-[70%] p-3 rounded-lg'
              style={{
                backgroundColor: msg.role === 'user' ? '#2563eb' : '#111827',
                color: msg.role === 'user' ? '#fff' : '#d1d5db',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className='text-gray-400'>AI is thinking...</div>}
      </div>
      <div className='border-t border-gray-700 p-4 flex gap-2'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder='Ask a question...'
          className='flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2'
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className='bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg disabled:opacity-50'
        >
          Send
        </button>
      </div>
    </div>
  );
}

