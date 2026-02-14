import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-toastify';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    availableSeats: '',
    image: '',
    videoLink: '',
  });

  const { data: myClasses = [], isLoading } = useQuery({
    queryKey: ['instructor-classes', user?.email],
    queryFn: () => api.get(`/classes/${user?.email}`).then((r) => r.data),
    enabled: !!user?.email,
  });

  const addClass = useMutation({
    mutationFn: (data) => api.post('/new-class', {
      ...data,
      instructorEmail: user.email,
      instructorName: user.name,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['instructor-classes']);
      setShowForm(false);
      setForm({ name: '', description: '', price: '', availableSeats: '', image: '', videoLink: '' });
      toast.success('Class added! Pending approval.');
    },
    onError: () => toast.error('Failed to add class'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addClass.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin w-12 h-12 border-4 border-secondary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Instructor Dashboard</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90"
      >
        {showForm ? 'Cancel' : 'Add New Class'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-xl shadow space-y-4 max-w-md">
          <input
            placeholder="Class Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Available Seats"
            value={form.availableSeats}
            onChange={(e) => setForm({ ...form, availableSeats: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            placeholder="Video Link"
            value={form.videoLink}
            onChange={(e) => setForm({ ...form, videoLink: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            disabled={addClass.isPending}
            className="w-full py-2 bg-secondary text-white rounded-lg"
          >
            {addClass.isPending ? 'Adding...' : 'Add Class'}
          </button>
        </form>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {myClasses.map((cls) => (
          <div key={cls._id} className="flex gap-4 p-4 bg-white rounded-xl shadow">
            <img src={cls.image} alt="" className="w-24 h-24 object-cover rounded" />
            <div>
              <h3 className="font-semibold">{cls.name}</h3>
              <p className="text-sm text-gray-500">$ {cls.price} - {cls.availableSeats} seats</p>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  cls.status === 'approved' ? 'bg-green-100 text-green-700' :
                  cls.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}
              >
                {cls.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
