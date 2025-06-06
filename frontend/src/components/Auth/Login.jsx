// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/chats', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] relative">
      {/* Diagonal accent stripe behind the card */}
      <div className="absolute top-[-10%] left-[-15%] w-[700px] h-[200px] bg-gradient-to-r from-indigo-400 to-pink-400 rotate-[-25deg] opacity-20 blur-2xl"></div>

      <div className="relative w-full max-w-md backdrop-glass rounded-3xl shadow-2xl overflow-hidden">
        {/* Top “header” bar with gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <h2 className="text-3xl font-bold text-white text-center">Log In</h2>
        </div>
        {/* Form body */}
        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-red-600/20 text-red-200 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-100 mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-white/30 border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-100 mb-2">Password</label>
              <input
                type="password"
                className="w-full bg-white/30 border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-2 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Log In
            </button>
          </form>
          <p className="text-center text-gray-200 text-sm">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-indigo-300 hover:text-white underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
