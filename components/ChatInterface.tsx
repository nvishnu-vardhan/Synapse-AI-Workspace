'use client';
import { useState } from 'react';

export default function ChatInterface({ documentId }: { documentId: string | null }) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          documentId: documentId || '' 
        }),
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response || data.message || 'No response'
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Error: Could not get response' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!documentId) {
    return (
      <div className='border-2 border-gray-700 rounded-lg p-8 text-center bg-gray-800/50'>
        <p className='text-gray-400'>📤 Upload a document first to start chatting</p>
      </div>
    );
  }

  return (
    <div className='border-2 border-gray-700 rounded-lg bg-gray-800/50 flex flex-col h-[500px]'>
      <div className='flex-1 overflow-y-auto p-4 space-y-3'>
        {messages.length === 0 ? (
          <p className='text-gray-400 text-center'>💡 Ask me anything about your document!</p>
        ) : (
          messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-600/30 ml-8 border-l-4 border-blue-500' 
                  : 'bg-gray-700/50 mr-8 border-l-4 border-purple-500'
              }`}
            >
              <p className='text-xs font-bold mb-1 text-gray-300'>
                {msg.role === 'user' ? '👤 You' : '🤖 AI Assistant'}
              </p>
              <p className='text-sm text-gray-100'>{msg.content}</p>
            </div>
          ))
        )}
        {loading && (
          <p className='text-center text-gray-400 animate-pulse'>🤔 AI is thinking...</p>
        )}
      </div>
      
      <div className='p-4 border-t-2 border-gray-700 flex gap-2'>
        <input
          type='text'
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
          placeholder='Type your question...'
          className='flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-blue-500 focus:outline-none'
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className='px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors'
        >
          {loading ? '⏳' : '📤'}
        </button>
      </div>
    </div>
  );
}
