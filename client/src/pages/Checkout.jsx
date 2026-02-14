import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || 'pk_test_demo');

function CheckoutForm({ cartItems, user, clientSecret, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + parseInt(item.price || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: window.location.origin + '/dashboard',
          receipt_email: user.email,
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        if (paymentIntent?.status === 'succeeded') {
          await api.post('/payment-info', {
            userEmail: user.email,
            userName: user.name,
            classesId: cartItems.map((c) => c._id),
            transactionId: paymentIntent.id,
          });
          toast.success('Payment successful!');
          onSuccess();
        } else {
          onSuccess();
        }
      }
    } catch (err) {
      toast.error('Payment failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>${total}</span>
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 bg-secondary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${total}`}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');

  const { data: cartItems = [], refetch } = useQuery({
    queryKey: ['cart', user?.email],
    queryFn: () => api.get(`/cart/${user?.email}`).then((r) => r.data),
    enabled: !!user?.email,
  });

  const total = cartItems.reduce((sum, item) => sum + parseInt(item.price || 0), 0);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (user && cartItems.length > 0 && total > 0) {
      api.post('/create-payment-intent', { price: total }).then(({ data }) => {
        setClientSecret(data.clientSecret);
      }).catch(() => setClientSecret(null));
    }
  }, [user, cartItems.length, total]);

  if (!user) return null;

  if (cartItems.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-600">Your cart is empty</p>
        <button
          onClick={() => navigate('/classes')}
          className="mt-4 text-secondary font-medium"
        >
          Browse Classes
        </button>
      </div>
    );
  }

  const options = { clientSecret, appearance: { theme: 'stripe' } };

  return (
    <div className="py-16 max-w-md mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              cartItems={cartItems}
              user={user}
              clientSecret={clientSecret}
              onSuccess={() => {
                refetch();
                navigate('/dashboard');
              }}
            />
          </Elements>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin w-10 h-10 border-2 border-secondary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600">Loading checkout...</p>
          </div>
        )}
      </div>
    </div>
  );
}
