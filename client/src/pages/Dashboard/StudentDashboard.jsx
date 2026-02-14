import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: enrolled = [], isLoading } = useQuery({
    queryKey: ['enrolled', user?.email],
    queryFn: () => api.get(`/enrolled-classes/${user?.email}`).then((r) => r.data),
    enabled: !!user?.email,
  });

  const { data: paymentHistory = [] } = useQuery({
    queryKey: ['payment-history', user?.email],
    queryFn: () => api.get(`/payment-history/${user?.email}`).then((r) => r.data),
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin w-12 h-12 border-4 border-secondary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">My Enrolled Classes</h2>
          {enrolled.length === 0 ? (
            <p className="text-gray-500">No enrolled classes yet.</p>
          ) : (
            <div className="space-y-3">
              {enrolled.map((item) => (
                <div
                  key={item.classes?._id}
                  className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.classes?.image}
                    alt=""
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{item.classes?.name}</h3>
                    <p className="text-sm text-gray-500">{item.classes?.instructorName}</p>
                    {item.classes?.videoLink && (
                      <a
                        href={item.classes.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-secondary hover:underline"
                      >
                        Watch →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Payment History</h2>
          {paymentHistory.length === 0 ? (
            <p className="text-gray-500">No payments yet.</p>
          ) : (
            <div className="space-y-2">
              {paymentHistory.slice(0, 5).map((p) => (
                <div
                  key={p._id}
                  className="flex justify-between py-2 border-b last:border-0"
                >
                  <span className="text-sm">${p.amount}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(p.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link to="/classes" className="text-blue-500 font-medium hover:underline">
          Browse more classes →
        </Link>
        {user?.role !== 'instructor' && user?.role !== 'admin' && (
          <Link to="/apply-instructor" className="text-blue-500 font-medium hover:underline">
            Apply as Instructor →
          </Link>
        )}
      </div>
    </div>
  );
}
