import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function ApplyInstructor() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    experience: '',
    skills: '',
    message: '',
  });

  const { data: alreadyApplied } = useQuery({
    queryKey: ['applied-instructor', user?.email],
    queryFn: () => api.get(`/applied-instructors/${user?.email}`).then((r) => r.data),
    enabled: !!user?.email,
  });

  const applyMutation = useMutation({
    mutationFn: (data) => api.post('/as-instructor', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['applied-instructor']);
      toast.success('Application submitted! We will review it soon.');
      setForm({ ...form, experience: '', skills: '', message: '' });
    },
    onError: () => toast.error('Failed to submit application'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    applyMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      experience: form.experience,
      skills: form.skills,
      message: form.message,
    });
  };

  if (!user) {
    return (
      <div className="py-16 text-center pt-24">
        <p className="text-gray-600">Please login to apply as an instructor.</p>
        <Link to="/login" className="text-blue-500 font-medium mt-4 inline-block">
          Login
        </Link>
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <div className="py-16 max-w-md mx-auto px-4 pt-24">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Application Submitted</h2>
          <p className="text-green-700">Your instructor application has been received. We will review it and get back to you soon.</p>
          <Link to="/dashboard" className="inline-block mt-4 text-blue-500 font-medium hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 max-w-lg mx-auto px-4 pt-24">
      <h1 className="text-2xl font-bold mb-6">Apply as Instructor</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1234567890"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
          <input
            type="text"
            placeholder="e.g. 5 years of yoga teaching"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills / Specializations</label>
          <input
            type="text"
            placeholder="e.g. Hatha, Vinyasa, Meditation"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            placeholder="Tell us why you want to join as an instructor..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={applyMutation.isPending}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
