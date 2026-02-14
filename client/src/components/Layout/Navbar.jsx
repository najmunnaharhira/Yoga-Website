import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdown(false);
  };

  const { data: cartCount = 0 } = useQuery({
    queryKey: ['cart', user?.email],
    queryFn: async () => {
      const data = await api.get(`/cart/${user?.email}`).then((r) => r.data);
      return data?.length || 0;
    },
    enabled: !!user?.email,
    retry: false,
  });

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/instructors', label: 'Instructors' },
    { to: '/classes', label: 'Classes' },
    ...(user ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
    ...(user ? [{ to: '/cart', label: 'Cart', badge: cartCount }] : []),
  ];

  const linkClass = ({ isActive }) =>
    `transition ${isActive ? 'text-blue-400 font-medium' : 'text-white hover:text-blue-300'}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <span className="font-bold text-2xl text-white">YogaMaster</span>
            <span className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c-4 4-8 8-8 12 0 4 3.5 8 8 8s8-4 8-8c0-4-4-8-8-12zm0 16c-2.2 0-4-1.8-4-4 0-1.5 1.5-3.5 4-6 2.5 2.5 4 4.5 4 6 0 2.2-1.8 4-4 4z"/>
              </svg>
            </span>
            <div className="hidden sm:block ml-2">
              <p className="text-xs text-white/80">Quick Explore</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1 ${linkClass({ isActive })}`
                }
                onClick={() => setOpen(false)}
              >
                {link.label}
                {link.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-blue-500 rounded-full">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setDropdown(!dropdown)}
                    className="flex items-center"
                  >
                    <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0) || 'Y'}
                    </div>
                  </button>
                  {dropdown && (
                    <>
                      <div
                        className="fixed inset-0"
                        onClick={() => setDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700">
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdown(false)}
                          className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/cart"
                          onClick={() => setDropdown(false)}
                          className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          Cart
                        </Link>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Logout
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition"
                >
                  {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition"
                >
                  {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {user && (
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            )}
            <button className="p-2" onClick={() => setOpen(!open)}>
              {open ? <FiX size={24} className="text-white" /> : <FiMenu size={24} className="text-white" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-white/20">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block py-2 ${isActive ? 'text-blue-400' : 'text-white'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-white">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
