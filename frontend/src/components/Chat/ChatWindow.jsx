// src/components/Chat/ChatWindow.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../utils/api';
import { FiSend, FiChevronLeft } from 'react-icons/fi';

export default function ChatWindow() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch chat history
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await API.get(`/chat/${chatId}`);
        setMessages(res.data.chat.messages);
      } catch {
        setError('Could not load chat. It may have been deleted.');
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [chatId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    setError('');

    // Optimistic user message
    const newUserMsg = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMsg]);
    const textToSend = input.trim();
    setInput('');

    try {
      const res = await API.post('/chat/message', { chatId, message: textToSend });
      const assistantMsg = {
        role: 'assistant',
        content: res.data.assistant.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setError('Failed to send message. Try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <p className="text-gray-300">Loading chat…</p>;
  }

  if (error) {
    return (
      <div className="max-w4xl mx-auto text-center text-red-400">
        <p className="mb-4">{error}</p>
        <Link to="/chats" className="text-indigo-300 hover:text-white transition-colors flex justify-center items-center">
          <FiChevronLeft className="mr-2 text-lg" />
          Back to Chats
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[80vh] relative">
      {/* Chat card background */}
      <div className="absolute inset-0 backdrop-glass-dark rounded-3xl shadow-2xl"></div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center px-6 py-4 border-b border-gray-600">
        <Link to="/chats" className="text-indigo-300 hover:text-white transition-colors flex items-center mr-4">
          <FiChevronLeft size={24} />
        </Link>
        <h2 className="text-xl font-semibold text-white neon-text">
          {/** Optionally derive thread title here */}
          Chat Session
        </h2>
      </div>

      {/* Messages area */}
      <div className="relative z-10 flex-grow overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative max-w-[70%] px-6 py-4 break-words text-white ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-500 to-pink-500 rounded-tl-2xl rounded-bl-2xl rounded-tr-xl'
                  : 'bg-white/20 text-gray-100 dark:text-gray-200 rounded-tr-2xl rounded-br-2xl rounded-tl-xl'
              } shadow-lg`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="absolute bottom-1 right-3 text-xs text-gray-200/70">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="relative z-10 px-6 py-4 border-t border-gray-600 flex items-center"
      >
        <input
          type="text"
          className="flex-grow bg-transparent border border-gray-600 rounded-full px-5 py-2 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />
        <button
          type="submit"
          className={`ml-3 bg-gradient-to-r from-indigo-500 to-pink-500 p-3 rounded-full shadow-lg hover:from-indigo-600 hover:to-pink-600 transition-all flex items-center ${
            sending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={sending}
        >
          <FiSend className="text-xl text-white" />
        </button>
      </form>
    </div>
  );
}
