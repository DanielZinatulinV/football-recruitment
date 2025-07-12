import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCandidates } from '../teams/TeamDashboard';

// Универсальный ключ для localStorage
const INBOX_KEY = 'unified_inbox_dialogs';

// Универсальные мок-данные (можно расширять для разных ролей)
const mockDialogs = [
  {
    id: 1,
    title: 'FC Digital United',
    participant: { id: 1, name: 'Анна Смирнова' },
    lastMessage: 'Thank you for your response! We will contact you soon.',
    date: '2024-06-01 14:20',
    unread: true,
    thread: [
      { from: 'FC Digital United', text: 'Thank you for your response! We will contact you soon.', date: '2024-06-01 14:20', read: true },
      { from: 'You', text: 'Hello! I have applied for the marketing position.', date: '2024-06-01 13:55', read: true },
    ],
  },
  {
    id: 2,
    title: 'FC Creative Stars',
    participant: { id: 2, name: 'Иван Петров' },
    lastMessage: 'Great portfolio! When can you do an interview?',
    date: '2024-05-29 10:05',
    unread: false,
    thread: [
      { from: 'FC Creative Stars', text: 'Great portfolio! When can you do an interview?', date: '2024-05-29 10:05', read: true },
      { from: 'You', text: 'Good afternoon! I have sent my portfolio for the designer position.', date: '2024-05-29 09:40', read: true },
    ],
  },
];

function getDialogs() {
  const saved = localStorage.getItem(INBOX_KEY);
  if (saved) return JSON.parse(saved);
  return mockDialogs;
}

const Inbox: React.FC = () => {
  const navigate = useNavigate();
  const [dialogs, setDialogs] = useState(getDialogs());
  const [selected, setSelected] = useState<number | null>(dialogs[0]?.id || null);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(INBOX_KEY, JSON.stringify(dialogs));
  }, [dialogs]);

  const dialog = dialogs.find((d: any) => d.id === selected);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !dialog) return;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 16).replace('T', ' ');
    const newMsg = { from: 'You', text: message, date: dateStr, read: true };
    const updatedDialogs = dialogs.map((d: any) =>
      d.id === dialog.id
        ? {
            ...d,
            thread: [...d.thread, newMsg],
            lastMessage: message,
            date: dateStr,
            unread: false,
          }
        : d
    );
    setDialogs(updatedDialogs);
    setMessage('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleDelete = (id: number) => {
    setDialogs(ds => ds.filter(d => d.id !== id));
    if (selected === id) setSelected(null);
  };

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-yellow-300 mb-8 uppercase">Inbox</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Список диалогов */}
          <div className="flex-1 min-w-[260px]">
            <div className="bg-white rounded-2xl shadow divide-y divide-gray-100">
              {dialogs.map((d: any) => (
                <div
                  key={d.id}
                  onClick={() => setSelected(d.id)}
                  className={`cursor-pointer px-5 py-4 flex items-center gap-3 transition-colors ${selected === d.id ? 'bg-yellow-50' : 'hover:bg-yellow-100'}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate text-black">{d.title}</div>
                    <div className="text-gray-700 text-sm truncate max-w-full">{d.lastMessage}</div>
                  </div>
                  <div className="flex flex-col items-end min-w-[80px] ml-2">
                    <div className="text-gray-400 text-xs whitespace-nowrap">{d.date}</div>
                    {d.unread && <span className="bg-yellow-300 text-black rounded px-2 py-0.5 text-xs mt-1 font-bold">new</span>}
                  </div>
                  <button className="ml-2 text-red-400 hover:text-red-600 text-lg" onClick={e => { e.stopPropagation(); handleDelete(d.id); }} title="Удалить диалог">&times;</button>
                </div>
              ))}
              {dialogs.length === 0 && <div className="text-gray-500 p-8 text-center">No messages</div>}
            </div>
          </div>
          {/* Окно сообщений */}
          <div className="flex-2 min-w-[260px] w-full">
            <div className="bg-white rounded-2xl shadow p-8 min-h-[220px] flex flex-col">
              {!dialog ? (
                <div className="text-gray-400 text-center mt-10">Select a conversation to view message history</div>
              ) : (
                <>
                  <div className="font-bold text-xl mb-3 text-black">{dialog.title}</div>
                  <div className="flex flex-col gap-3 flex-1 mb-4 overflow-y-auto max-h-[320px]">
                    {dialog.thread.map((msg: any, idx: number) => (
                      <div key={idx} className={`max-w-[340px] rounded-lg px-4 py-3 ${msg.from === 'You' ? 'self-end bg-yellow-50 border border-yellow-300' : 'self-start bg-gray-100 border border-gray-200'}`}>
                        <div className="font-medium mb-1 text-black">{msg.from}</div>
                        <div className="text-black">{msg.text}</div>
                        <div className="text-gray-400 text-xs mt-1">{msg.date}</div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSend} className="flex gap-2 mt-auto">
                    <input
                      ref={inputRef}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-lg border-2 border-yellow-300 px-3 py-2 text-base bg-neutral-100 text-black placeholder-gray-400"
                    />
                    <button type="submit" className="rounded-lg px-6 py-2 bg-yellow-300 text-black font-bold border-2 border-yellow-300 hover:bg-yellow-400 transition">Send</button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox; 