import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/yoga-logo.png" alt="Yoga Master" className="h-10 w-10" />
              <span className="font-bold text-xl text-white">Yoga Master</span>
            </div>
            <p className="text-sm">
              Learn yoga from the comfort of your home. Transform your mind and body with our expert instructors.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/classes" className="hover:text-white transition">Classes</Link></li>
              <li><Link to="/instructors" className="hover:text-white transition">Instructors</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <p className="text-sm">support@yogamaster.com</p>
            <p className="text-sm mt-2">© {new Date().getFullYear()} Yoga Master. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
