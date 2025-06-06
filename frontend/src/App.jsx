// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ← Use a default import for particles-bg:
import ParticlesBg from 'particles-bg';

import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import ChatList from './components/Chat/ChatList';
import ChatWindow from './components/Chat/ChatWindow';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        {/*
          Render ParticlesBg with bg={true} so it covers the full screen behind your content.
          Because Layout positions its children relative, we can absolutely position the particles.
        */}
        <ParticlesBg type="cobweb" bg={true} />

        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Redirect root based on auth */}
          <Route
            path="/"
            element={
              !localStorage.getItem('token') ? (
                <Navigate to="/login" replace />
              ) : (
                <Navigate to="/chats" replace />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/chats"
            element={
              <PrivateRoute>
                <ChatList />
              </PrivateRoute>
            }
          />
          <Route
            path="/chats/:chatId"
            element={
              <PrivateRoute>
                <ChatWindow />
              </PrivateRoute>
            }
          />

          {/* Catch‐all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
