// src/components/Chat/ChatList.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function ChatList() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await API.get('/chat/threads');
        setThreads(res.data.threads);
      } catch {
        setError('Failed to load chat threads');
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, []);

  const handleNewChat = async () => {
    try {
      const res = await API.post('/chat/new');
      const newChatId = res.data.chat._id;
      navigate(`/chats/${newChatId}`);
    } catch {
      setError('Could not create a new chat');
    }
  };

  const handleDelete = async (chatId) => {
    if (!confirm('Delete this chat? This cannot be undone.')) return;
    try {
      await API.delete(`/chat/${chatId}`);
      setThreads((prev) => prev.filter((t) => t._id !== chatId));
    } catch {
      setError('Could not delete chat');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with glowing button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold neon-text">Your Chats</h1>
        <button
          onClick={handleNewChat}
          className="flex items-center bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-5 py-3 rounded-full shadow-2xl hover:from-indigo-600 hover:to-pink-600 transition-all"
        >
          <FiPlus className="mr-2 text-xl" /> New Chat
        </button>
      </div>

      {error && (
        <div className="bg-red-600/20 text-red-200 p-4 rounded-lg mb-6 text-sm backdrop-glass">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-200">Loading threads…</p>
      ) : threads.length === 0 ? (
        <p className="text-gray-200">No chats yet. Click “New Chat” to get started.</p>
      ) : (
        <ul className="space-y-6">
          {threads.map((thread) => (
            <li
              key={thread._id}
              className="relative backdrop-glass rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden"
            >
              {/* Neon glow on hover */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity"></div>

              <Link to={`/chats/${thread._id}`} className="relative flex items-center">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-white truncate">
                    {thread.title || 'Untitled Chat'}
                  </h2>
                  <p className="text-sm text-gray-300 mt-1">
                    {new Date(thread.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="text-indigo-300 text-2xl ml-4 group-hover:text-white transition-colors">
                  &rarr;
                </span>
              </Link>

              <button
                onClick={() => handleDelete(thread._id)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"
              >
                <FiTrash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
