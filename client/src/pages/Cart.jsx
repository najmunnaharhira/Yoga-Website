import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.email],
    queryFn: () => api.get(`/cart/${user?.email}`).then((r) => r.data),
    enabled: !!user?.email,
    retry: false,
  });

  const removeMutation = useMutation({
    mutationFn: (classId) => api.delete(`/delete-cart-item/${classId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart', user?.email]);
      toast.success('Item removed from cart');
    },
    onError: () => toast.error('Failed to remove item'),
  });

  const removeItem = (classId) => removeMutation.mutate(classId);

  const total = cartItems.reduce((sum, item) => sum + parseInt(item.price || 0), 0);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center pt-24">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="py-16 max-w-4xl mx-auto px-4 pt-24">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link to="/classes" className="text-blue-500 font-medium hover:underline">
            Browse Classes →
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 p-4 bg-white rounded-lg shadow border"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-500">{item.instructorName}</p>
                  <p className="text-blue-500 font-medium">${item.price}</p>
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  disabled={removeMutation.isPending}
                  className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-4 block w-full py-3 bg-blue-500 text-white text-center rounded-lg font-medium hover:bg-blue-600 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
