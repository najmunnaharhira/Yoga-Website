import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);

  const { data: cls, isLoading } = useQuery({
    queryKey: ['class', id],
    queryFn: () => api.get(`/class/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const addToCart = async () => {
    if (!user) {
      toast.info('Please login to add to cart');
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await api.post('/add-to-cart', {
        classId: id,
        userMail: user.email,
      });
      toast.success('Added to cart!');
    } catch (err) {
      if (err.response?.data?.message?.includes('already')) {
        toast.info('Already in cart');
      } else {
        toast.error('Failed to add to cart');
      }
    }
    setAdding(false);
  };

  if (isLoading || !cls) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-secondary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="py-16 max-w-7xl mx-auto px-4">
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
            <span>${cls.price}</span>
          </div>
          <p className="mt-4 text-gray-600">{cls.description}</p>
          <div className="flex gap-6 mt-6">
            <span>Available seats: {cls.availableSeats}</span>
            <span>Enrolled: {cls.totalEnrolled || 0}</span>
          </div>
          <div className="mt-8 flex gap-4">
            <button
              onClick={addToCart}
              disabled={adding || cls.availableSeats <= 0}
              className="px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <Link
              to="/classes"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </Link>
          </div>
          {cls.videoLink && (
            <a
              href={cls.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-secondary hover:underline"
            >
              Watch preview →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
