import { useState } from 'react';

export default function RecipeChat() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();

    setMessages(prev => [
      ...prev,
      { role: 'assistant', text: data.reply }
    ]);
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-xl border">
      <div className="p-3 font-semibold bg-orange-500 text-white rounded-t-xl">
        🍽️ Recipe Assistant
      </div>

      <div className="p-3 h-64 overflow-y-auto space-y-2 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === 'user' ? 'text-right' : 'text-left'}
          >
            <span className="inline-block bg-gray-100 px-3 py-2 rounded-lg">
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div className="p-2 flex gap-2 border-t">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Ask about recipes..."
        />
        <button
          onClick={sendMessage}
          className="bg-orange-500 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
