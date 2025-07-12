import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCandidates } from './TeamDashboard';

const TEAM_INBOX_KEY = 'team_inbox';

// Мок-структура диалогов и сообщений
const initialDialogs = [
  {
    id: 1,
    candidateId: 1,
    messages: [
      { id: 1, sender: 'team', text: 'Здравствуйте, Анна!', timestamp: Date.now() - 86400000, read: true },
      { id: 2, sender: 'candidate', text: 'Добрый день! Готова обсудить вакансию.', timestamp: Date.now() - 86000000, read: true },
    ],
  },
  {
    id: 2,
    candidateId: 2,
    messages: [
      { id: 1, sender: 'candidate', text: 'Здравствуйте! Я заинтересован в вашей вакансии.', timestamp: Date.now() - 7200000, read: false },
    ],
  },
];

const TeamInbox = () => {
  const navigate = useNavigate();
  const [dialogs, setDialogs] = useState(initialDialogs);
  const [selectedId, setSelectedId] = useState<number | null>(dialogs[0]?.id || null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(TEAM_INBOX_KEY);
    if (stored) setDialogs(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(TEAM_INBOX_KEY, JSON.stringify(dialogs));
  }, [dialogs]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedId, dialogs]);

  const selectedDialog = dialogs.find(d => d.id === selectedId);
  const candidate = selectedDialog ? mockCandidates.find(c => c.id === selectedDialog.candidateId) : null;

  const handleSend = () => {
    if (!input.trim() || !selectedDialog) return;
    setDialogs(ds => ds.map(d => d.id === selectedDialog.id ? {
      ...d,
      messages: [...d.messages, { id: Date.now(), sender: 'team', text: input, timestamp: Date.now(), read: true }],
    } : d));
    setInput('');
  };

  const handleDelete = (id: number) => {
    setDialogs(ds => ds.filter(d => d.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <button className="mb-6 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300" onClick={() => navigate('/team/dashboard')}>
          ← Назад к Dashboard
        </button>
        <div className="bg-white rounded-xl shadow-lg flex overflow-hidden min-h-[500px]">
          {/* Список диалогов */}
          <div className="w-1/3 border-r p-4 bg-gray-50">
            <h2 className="text-lg font-bold mb-4">Диалоги</h2>
            <div className="flex flex-col gap-2">
              {dialogs.length === 0 && <div className="text-gray-400">Нет диалогов</div>}
              {dialogs.map(d => {
                const cand = mockCandidates.find(c => c.id === d.candidateId);
                const lastMsg = d.messages[d.messages.length - 1];
                const unread = d.messages.some(m => m.sender === 'candidate' && !m.read);
                return (
                  <div
                    key={d.id}
                    className={`rounded-lg px-3 py-2 cursor-pointer flex flex-col border transition ${selectedId === d.id ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200 hover:bg-blue-50'}`}
                    onClick={() => setSelectedId(d.id)}
                  >
                    <div className="font-semibold">{cand ? `${cand.firstName} ${cand.lastName}` : 'Кандидат'}</div>
                    <div className="text-xs text-gray-500 truncate">{lastMsg?.text}</div>
                    {unread && <span className="text-xs text-amber-500 font-bold">Непрочитанные</span>}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Сообщения */}
          <div className="flex-1 flex flex-col">
            {selectedDialog && candidate ? (
              <>
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <div className="font-bold text-blue-700">{candidate.firstName} {candidate.lastName}</div>
                  <button className="text-red-500 hover:underline text-sm" onClick={() => handleDelete(selectedDialog.id)}>Удалить диалог</button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-50">
                  {selectedDialog.messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'team' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`rounded-xl px-4 py-2 max-w-[70%] ${m.sender === 'team' ? 'bg-blue-200 text-right' : 'bg-white border'}`}>
                        <div className="text-sm">{m.text}</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(m.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="border-t px-6 py-4 flex gap-2 bg-white">
                  <input
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-base"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Введите сообщение..."
                    onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                  />
                  <button
                    className="rounded-lg px-5 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    onClick={handleSend}
                  >
                    Отправить
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">Выберите диалог</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInbox; 