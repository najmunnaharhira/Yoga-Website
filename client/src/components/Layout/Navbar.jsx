import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdown(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/classes', label: 'Classes' },
    { to: '/instructors', label: 'Instructors' },
    ...(user ? [{ to: '/cart', label: 'Cart' }] : []),
  ];

  return (
    <nav className="bg-white/95 backdrop-blur shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/yoga-logo.png" alt="Yoga Master" className="h-10 w-10" />
            <span className="font-bold text-xl text-secondary">Yoga Master</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-secondary transition"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <img
                    src={user.photoUrl || '/logo.png'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => (e.target.src = '/logo.png')}
                  />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                {dropdown && (
                  <>
                    <div
                      className="fixed inset-0"
                      onClick={() => setDropdown(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 border">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        <FiUser /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-50 text-left text-red-600"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block py-2 text-gray-700"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="block py-2 text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block py-2 text-secondary font-medium"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
