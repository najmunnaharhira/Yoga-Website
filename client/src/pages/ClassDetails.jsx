import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { getFallbackClassById } from '../api/fallback';
import { toast } from 'react-toastify';

export default function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);

  const { data: cls, isLoading, isError } = useQuery({
    queryKey: ['class', id],
    queryFn: () =>
      api
        .get(`/class/${id}`)
        .then((r) => r.data)
        .catch(() => getFallbackClassById(id)),
    enabled: !!id,
    retry: false,
  });

  const { data: inCart } = useQuery({
    queryKey: ['cart-item', id, user?.email],
    queryFn: () => api.get(`/cart-item/${id}`, { params: { email: user?.email } }).then((r) => r.data),
    enabled: !!user?.email && !!id,
    retry: false,
  });

  const addToCart = async () => {
    if (!user) {
      toast.info('Please login to add to cart');
      navigate('/login');
      return;
    }
    if (inCart) {
      toast.info('Already in cart');
      return;
    }
    setAdding(true);
    try {
      await api.post('/add-to-cart', {
        classId: id,
        userMail: user.email,
      });
      toast.success('Added to cart!');
      navigate('/cart');
    } catch (err) {
      if (err.response?.data?.message?.toLowerCase().includes('already') || err.response?.status === 409) {
        toast.info('Already in cart');
      } else {
        toast.error('Failed to add to cart');
      }
    }
    setAdding(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center pt-24">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center pt-24 px-4">
        <p className="text-gray-500 mb-4">
          {isError ? 'Class not found. Start the server for live data.' : 'Class not found.'}
        </p>
        <Link to="/classes" className="text-blue-500 font-medium hover:underline">
          ← Back to Classes
        </Link>
      </div>
    );
  }

  const alreadyInCart = !!inCart;

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 pt-24">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="rounded-xl overflow-hidden shadow-xl">
          <img
            src={cls.image}
            alt={cls.name}
            className="w-full h-80 object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{cls.name}</h1>
          <div className="flex gap-4 mt-4 text-gray-600">
            <span>Instructor: {cls.instructorName}</span>
            <span className="text-blue-500 font-semibold">${cls.price}</span>
          </div>
          <p className="mt-4 text-gray-600">{cls.description}</p>
          <div className="flex gap-6 mt-6">
            <span>Available seats: {cls.availableSeats}</span>
            <span>Enrolled: {cls.totalEnrolled || 0}</span>
          </div>
          <div className="mt-8 flex gap-4">
            <button
              onClick={addToCart}
              disabled={adding || cls.availableSeats <= 0 || alreadyInCart}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {adding ? 'Adding...' : alreadyInCart ? 'In Cart' : 'Add to Cart'}
            </button>
            <Link
              to="/classes"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Back
            </Link>
            {alreadyInCart && (
              <Link
                to="/cart"
                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition"
              >
                View Cart
              </Link>
            )}
          </div>
          {cls.videoLink && (
            <a
              href={cls.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-blue-500 hover:underline"
            >
              Watch preview →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
