import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessagesService } from '../../api/services/MessagesService';
import type { MessageThreadSchema } from '../../api/models/MessageThreadSchema';
import type { OutMessageSchema } from '../../api/models/OutMessageSchema';
import { useAppDispatch } from '../../redux/store';
import { setUnreadMessagesCount } from '../../redux/slices/auth.slice';
import { CandidatesService } from '../../api/services/CandidatesService';
import { AdminService } from '../../api/services/AdminService';

const Inbox: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [threads, setThreads] = useState<MessageThreadSchema[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Для истории сообщений
  const [messages, setMessages] = useState<OutMessageSchema[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const pollingRef = useRef<any>(null);

  const [tempUser, setTempUser] = useState<null | { id: number; name: string; role: string }>(null);
  const [tempUserLoading, setTempUserLoading] = useState(false);
  const [tempUserError, setTempUserError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const selectedThread = threads.find((t) => t.user_id === selected);

  // При монтировании: если есть query-параметр user, открываем нужный диалог
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userParam = params.get('user');
    if (userParam) {
      const userId = Number(userParam);
      if (!isNaN(userId)) {
        setSelected(userId);
        // Если такого треда нет, подгружаем имя пользователя
        if (!threads.some(t => t.user_id === userId)) {
          setTempUserLoading(true);
          setTempUserError(null);
          // Пробуем сначала как кандидата
          CandidatesService.getCandidateProfileV1CandidatesCandidateIdGet(userId)
            .then(u => setTempUser({ id: u.id, name: `${u.first_name} ${u.last_name}`, role: u.role }))
            .catch(() => {
              // Если не кандидат — пробуем как команду
              AdminService.getUserByIdV1AdminUsersUserIdGet(userId)
                .then(u => setTempUser({ id: u.id, name: u.club_name || `${u.first_name} ${u.last_name}`, role: u.role }))
                .catch(() => setTempUserError('User not found'));
            })
            .finally(() => setTempUserLoading(false));
        } else {
          setTempUser(null);
        }
      }
    } else {
      setTempUser(null);
    }
  }, [location.search, threads]);

  // Загрузка истории сообщений при смене selected + polling
  useEffect(() => {
    if (!selected) {
      setMessages([]);
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }
    let cancelled = false;
    const fetchMessages = () => {
      setMessagesLoading(true);
      setMessagesError(null);
      MessagesService.getConversationV1MessagesConversationUserIdGet(selected)
        .then((data) => {
          if (cancelled) return;
          setMessages(data);
          // Пометка как прочитанных
          const unread = data.filter(m => !m.is_read && m.receiver_id === selectedThread?.user_id);
          unread.forEach(msg => {
            MessagesService.markMessageAsReadV1MessagesMessageIdReadPatch(msg.id)
              .then(() => {
                // После успешной пометки можно обновить счетчик в треде
                setThreads(threads => threads.map(t =>
                  t.user_id === selectedThread?.user_id ? { ...t, unread_count: 0 } : t
                ));
              })
              .catch(() => {});
          });
        })
        .catch(() => {
          if (cancelled) return;
          setMessagesError('Error loading messages');
        })
        .finally(() => {
          if (cancelled) return;
          setMessagesLoading(false);
        });
    };
    fetchMessages();
    // Polling
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(fetchMessages, 7000);
    return () => {
      cancelled = true;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [selected, selectedThread?.user_id]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    MessagesService.getMessageThreadsV1MessagesThreadsGet()
      .then((data) => {
        setThreads(data);
        if (data.length > 0) setSelected(data[0].user_id);
        // Обновляем счетчик непрочитанных сообщений в Redux
        const unread = data.reduce((sum, t) => sum + (t.unread_count || 0), 0);
        dispatch(setUnreadMessagesCount(unread));
      })
      .catch((e) => {
        setError('Error loading conversations');
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  // Также обновляем счетчик при изменении threads (например, после пометки как прочитанных)
  useEffect(() => {
    const unread = threads.reduce((sum, t) => sum + (t.unread_count || 0), 0);
    dispatch(setUnreadMessagesCount(unread));
  }, [threads, dispatch]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const receiverId = selectedThread?.user_id || tempUser?.id;
    if (!message.trim() || !receiverId) return;
    setSending(true);
    setSendError(null);
    try {
      const sent = await MessagesService.sendMessageV1MessagesPost({
        receiver_id: receiverId,
        content: message,
      });
      setMessage('');
      setTimeout(() => inputRef.current?.focus(), 0);
      // После отправки сообщения обновляем список тредов и выбираем нужный тред
      MessagesService.getMessageThreadsV1MessagesThreadsGet()
        .then((data) => {
          setThreads(data);
          setSelected(receiverId);
        });
      // Также добавляем сообщение в историю (для плавного UX)
      setMessages((prev) => [...prev, sent]);
    } catch (err) {
      setSendError('Error sending message');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = (id: number) => {
    setThreads(ts => ts.filter(t => t.user_id !== id));
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
              {loading ? (
                <div className="text-gray-500 p-8 text-center">Loading conversations...</div>
              ) : error ? (
                <div className="text-red-500 p-8 text-center">{error}</div>
              ) : threads.length === 0 && tempUser ? (
                <div className="p-8 text-center">
                  <div className="font-bold text-black text-lg">{tempUser.name}</div>
                  <div className="text-gray-500 text-sm">{tempUser.role}</div>
                </div>
              ) : threads.length === 0 && tempUserLoading ? (
                <div className="text-gray-500 p-8 text-center">Loading user...</div>
              ) : threads.length === 0 && tempUserError ? (
                <div className="text-red-500 p-8 text-center">{tempUserError}</div>
              ) : threads.length === 0 ? (
                <div className="text-gray-500 p-8 text-center">No conversations</div>
              ) : (
                threads.map((t) => (
                  <div
                    key={t.user_id}
                    onClick={() => setSelected(t.user_id)}
                    className={`cursor-pointer px-5 py-4 flex items-center gap-3 transition-colors ${selected === t.user_id ? 'bg-yellow-50' : 'hover:bg-yellow-100'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate text-black">{t.user_name}</div>
                      <div className="text-gray-700 text-sm truncate max-w-full">{t.last_message}</div>
                    </div>
                    <div className="flex flex-col items-end min-w-[80px] ml-2">
                      <div className="text-gray-400 text-xs whitespace-nowrap">{new Date(t.last_message_time).toLocaleString()}</div>
                      {t.unread_count > 0 && <span className="bg-yellow-300 text-black rounded px-2 py-0.5 text-xs mt-1 font-bold">{t.unread_count} new</span>}
                    </div>
                    <button className="ml-2 text-red-400 hover:text-red-600 text-lg" onClick={e => { e.stopPropagation(); handleDelete(t.user_id); }} title="Удалить диалог">&times;</button>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Окно сообщений */}
          <div className="flex-2 min-w-[260px] w-full">
            <div className="bg-white rounded-2xl shadow p-8 min-h-[220px] flex flex-col">
              {/* Если выбран пользователь, но нет треда, показываем чат с tempUser */}
              {selected && !selectedThread && tempUser ? (
                <>
                  <div className="font-bold text-xl mb-3 text-black">{tempUser.name}</div>
                  <div className="flex-1 mb-4 flex items-center justify-center text-gray-400">Нет сообщений</div>
                  <form onSubmit={handleSend} className="flex gap-2 mt-auto">
                    <input
                      ref={inputRef}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-lg border-2 border-yellow-300 px-3 py-2 text-base bg-neutral-100 text-black placeholder-gray-400"
                    />
                    <button type="submit" disabled={sending} className="rounded-lg px-6 py-2 bg-yellow-300 text-black font-bold border-2 border-yellow-300 hover:bg-yellow-400 transition">Send</button>
                    {sendError && <div className="text-red-500 text-xs mt-1">{sendError}</div>}
                  </form>
                </>
              ) : !selectedThread ? (
                <div className="text-gray-400 text-center mt-10">Select a conversation to view message history</div>
              ) : messagesLoading ? (
                <div className="text-gray-400 text-center mt-10">Loading messages...</div>
              ) : messagesError ? (
                <div className="text-red-500 text-center mt-10">{messagesError}</div>
              ) : (
                <>
                  <div className="font-bold text-xl mb-3 text-black">{selectedThread.user_name}</div>
                  <div className="flex flex-col gap-3 flex-1 mb-4 overflow-y-auto max-h-[320px]">
                    {messages.length === 0 ? (
                      <div className="text-gray-400 text-center">No messages</div>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className={`max-w-[340px] rounded-lg px-4 py-3 ${msg.sender_id === selectedThread.user_id ? 'self-start bg-gray-100 border border-gray-200' : 'self-end bg-yellow-50 border border-yellow-300'}`}>
                          <div className="font-medium mb-1 text-black">{msg.sender_id === selectedThread.user_id ? selectedThread.user_name : 'Вы'}</div>
                          <div className="text-black">{msg.content}</div>
                          <div className="text-gray-400 text-xs mt-1">{new Date(msg.created_at).toLocaleString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                  <form onSubmit={handleSend} className="flex gap-2 mt-auto">
                    <input
                      ref={inputRef}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-lg border-2 border-yellow-300 px-3 py-2 text-base bg-neutral-100 text-black placeholder-gray-400"
                    />
                    <button type="submit" disabled={sending} className="rounded-lg px-6 py-2 bg-yellow-300 text-black font-bold border-2 border-yellow-300 hover:bg-yellow-400 transition">Send</button>
                    {sendError && <div className="text-red-500 text-xs mt-1">{sendError}</div>}
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