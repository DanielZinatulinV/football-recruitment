import React, { useState, useEffect, useRef } from 'react';

const DIALOGS_KEY = 'candidate_dialogs';

const mockDialogs = [
  {
    id: 1,
    company: 'FC Digital United',
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
    company: 'FC Creative Stars',
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
  const saved = localStorage.getItem(DIALOGS_KEY);
  if (saved) return JSON.parse(saved);
  return mockDialogs;
}

const CandidateInbox: React.FC = () => {
  const [dialogs, setDialogs] = useState(getDialogs());
  const [selected, setSelected] = useState<number | null>(dialogs[0]?.id || null);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(DIALOGS_KEY, JSON.stringify(dialogs));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Messages</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 min-w-[260px]">
            <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
              {dialogs.map((d: any) => (
                <div
                  key={d.id}
                  onClick={() => setSelected(d.id)}
                  className={`cursor-pointer px-5 py-4 flex items-center gap-3 transition-colors ${selected === d.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{d.company}</div>
                    <div className="text-gray-700 text-sm truncate max-w-full">{d.lastMessage}</div>
                  </div>
                  <div className="flex flex-col items-end min-w-[80px] ml-2">
                    <div className="text-gray-400 text-xs whitespace-nowrap">{d.date}</div>
                    {d.unread && <span className="bg-blue-600 text-white rounded px-2 py-0.5 text-xs mt-1">new</span>}
                  </div>
                </div>
              ))}
              {dialogs.length === 0 && <div className="text-gray-500 p-8 text-center">No messages</div>}
            </div>
          </div>
          <div className="flex-2 min-w-[260px] w-full">
            <div className="bg-white rounded-xl shadow-sm p-6 min-h-[220px] flex flex-col">
              {!dialog ? (
                <div className="text-gray-500 text-center mt-10">Select a conversation to view message history</div>
              ) : (
                <>
                  <div className="font-semibold text-lg mb-3">{dialog.company}</div>
                  <div className="flex flex-col gap-3 flex-1 mb-4 overflow-y-auto max-h-[320px]">
                    {dialog.thread.map((msg: any, idx: number) => (
                      <div key={idx} className={`max-w-[340px] rounded-lg px-4 py-3 ${msg.from === 'You' ? 'self-end bg-blue-50' : 'self-start bg-gray-100'}`}>
                        <div className="font-medium mb-1">{msg.from}</div>
                        <div>{msg.text}</div>
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
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-base"
                    />
                    <button type="submit" className="rounded-lg px-5 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Send</button>
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

export default CandidateInbox; 