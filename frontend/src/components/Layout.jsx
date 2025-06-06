// src/components/Layout.jsx
import { Link, useNavigate } from 'react-router-dom';
import ParticlesBg from 'particles-bg';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div
      className="
        relative overflow-hidden 
        min-h-screen flex flex-col 
        bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900
      "
    >
      {/* 1) Particles background (behind everything) */}
      <ParticlesBg type="cobweb" bg={true} />

      {/* 2) Animated, blurred “floating” circles behind */}
      <div className="
          absolute top-[-10%] left-[-20%]
          w-[500px] h-[500px] rounded-full
          bg-gradient-to-r from-indigo-500 to-pink-500
          opacity-30 animate-[floatA_8s_ease-in-out_infinite]
          filter blur-3xl
        "
      ></div>
      <div className="
          absolute bottom-[-5%] right-[-15%]
          w-[600px] h-[600px] rounded-full
          bg-gradient-to-r from-purple-500 to-indigo-500
          opacity-30 animate-[floatB_10s_ease-in-out_infinite]
          filter blur-3xl
        "
      ></div>

      {/* 3) Header (transparent + glass) */}
      <header className="sticky top-0 z-10 bg-white/20 backdrop-glass py-4">
        <div className="container mx-auto flex items-center justify-between px-6">
          {/* Left spacer to help center the logo */}
          <div className="w-1/3" />

          {/* Centered neon logo */}
          <Link
            to="/"
            className="w-1/3 text-center neon-text text-3xl font-extrabold uppercase"
          >
            NeuraQuill BOT
          </Link>

          {/* Right nav */}
          <nav className="w-1/3 flex justify-end space-x-6">
            {token ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-400 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* 4) Main content area (flex-grow so footer is at bottom) */}
      <main className="relative z-20 flex-grow container mx-auto px-6 py-10">
        {children}
      </main>

      {/* 5) Footer (stays at bottom because main flex-grew) */}
      <footer className="bg-white/10 backdrop-glass-dark py-4">
        <div className="container mx-auto text-center text-gray-300 text-sm">
          © {new Date().getFullYear()} Made with Gemini API.
        </div>
      </footer>
    </div>
  );
}
