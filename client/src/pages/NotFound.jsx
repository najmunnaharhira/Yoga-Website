import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-8xl font-bold text-primary/30">404</div>
      <h1 className="text-4xl font-bold text-gray-900 mt-8">Page Not Found</h1>
      <p className="text-gray-600 mt-2">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:opacity-90"
      >
        Go Home
      </Link>
    </div>
  );
}
