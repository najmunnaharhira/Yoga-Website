import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function DemoLogin({ title, subtitle, onLogin, loginLink, registerLink }) {
  const [name, setName] = useState('Demo User');
  const [email, setEmail] = useState('demo@yogamaster.com');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(name, email);
      toast.success('Demo login successful!');
      window.location.href = '/';
    } catch (err) {
      toast.error(err.message || 'Demo login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-xl shadow-lg border border-amber-100">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            <strong>Note:</strong> Start the server first: <code className="text-xs">cd server && npm start</code>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Demo Login'}
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            To enable Firebase auth, add VITE_FIREBASE_* env vars. See <code className="text-xs">client/.env.example</code>
          </p>
        </form>
        <p className="text-center mt-4 text-gray-600">
          <Link to={loginLink} className="text-blue-500 font-medium hover:underline">Login</Link>
          {' · '}
          <Link to={registerLink} className="text-blue-500 font-medium hover:underline">Register</Link>
          {' · '}
          <Link to="/" className="text-blue-500 font-medium hover:underline">← Home</Link>
        </p>
      </div>
    </div>
  );
}
