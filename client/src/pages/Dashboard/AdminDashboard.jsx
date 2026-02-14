import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [statusModal, setStatusModal] = useState(null);

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin-stats').then((r) => r.data),
    enabled: user?.role === 'admin',
  });

  const { data: classesRaw } = useQuery({
    queryKey: ['classes-manage'],
    queryFn: () => api.get('/classes-manage').then((r) => r.data),
    enabled: user?.role === 'admin',
  });
  const classes = Array.isArray(classesRaw) ? classesRaw : [];

  const { data: usersRaw } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then((r) => r.data),
    enabled: user?.role === 'admin',
  });
  const users = Array.isArray(usersRaw) ? usersRaw : [];

  const updateStatus = useMutation({
    mutationFn: ({ id, status, reason }) =>
      api.put(`/change-status/${id}`, { status, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries(['classes-manage']);
      queryClient.invalidateQueries(['admin-stats']);
      setStatusModal(null);
      toast.success('Status updated');
    },
    onError: () => toast.error('Failed to update'),
  });

  if (user?.role !== 'admin') {
    return <p className="text-red-500">Access denied</p>;
  }

  const pendingClasses = classes.filter((c) => c.status === 'pending');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Approved</p>
          <p className="text-2xl font-bold">{stats?.approvedClasses ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold">{stats?.pendingClasses ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Instructors</p>
          <p className="text-2xl font-bold">{stats?.instructors ?? 0}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Enrolled</p>
          <p className="text-2xl font-bold">{stats?.totalEnrolled ?? 0}</p>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-lg mb-4">Pending Classes</h2>
          <div className="space-y-2">
            {pendingClasses.map((cls) => (
              <div
                key={cls._id}
                className="flex justify-between items-center p-4 bg-white rounded-lg shadow"
              >
                <div>
                  <h3 className="font-medium">{cls.name}</h3>
                  <p className="text-sm text-gray-500">{cls.instructorName}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateStatus.mutate({ id: cls._id, status: 'approved' })
                    }
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      setStatusModal({ id: cls._id, name: cls.name })
                    }
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b last:border-0">
                    <td className="p-4">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {statusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3>Deny: {statusModal.name}</h3>
            <input
              placeholder="Reason (optional)"
              className="w-full mt-2 px-4 py-2 border rounded"
              id="reason"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() =>
                  updateStatus.mutate({
                    id: statusModal.id,
                    status: 'denied',
                    reason: document.getElementById('reason')?.value,
                  })
                }
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Deny
              </button>
              <button
                onClick={() => setStatusModal(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
