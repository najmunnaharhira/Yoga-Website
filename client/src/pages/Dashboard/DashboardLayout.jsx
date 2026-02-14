import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiX, FiShoppingCart, FiBook, FiUsers } from 'react-icons/fi';

export default function DashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const isAdmin = user.role === 'admin';
  const isInstructor = user.role === 'instructor' || isAdmin;

  const links = [
    { to: '/dashboard', label: 'My Classes', icon: FiBook },
    { to: '/cart', label: 'Cart', icon: FiShoppingCart },
    ...(isInstructor ? [{ to: '/dashboard/instructor', label: 'Instructor', icon: FiBook }] : []),
    ...(isAdmin ? [{ to: '/dashboard/admin', label: 'Admin', icon: FiUsers }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside
          className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-4 flex justify-between items-center border-b">
            <span className="font-semibold">Dashboard</span>
            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX size={24} />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <link.icon />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <button
            className="md:hidden mb-4"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
