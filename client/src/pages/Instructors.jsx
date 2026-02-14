import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { getFallbackInstructors } from '../api/fallback';
import InstructorCard from '../components/InstructorCard';

export default function Instructors() {
  const { data: instructors = [], isLoading, isError } = useQuery({
    queryKey: ['instructors'],
    queryFn: () =>
      api
        .get('/instructors')
        .then((r) => r.data)
        .catch(() => getFallbackInstructors()),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-secondary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 pt-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Our Instructors</h1>
        <p className="text-gray-600 mt-2">Expert yoga teachers</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((inst) => (
          <InstructorCard
            key={inst._id}
            instructor={{
              ...inst,
              instructor: { name: inst.name, photoUrl: inst.photoUrl },
            }}
          />
        ))}
      </div>
      {instructors.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          {isError ? 'Unable to load instructors. Start the server for live data.' : 'No instructors yet.'}
        </p>
      )}
    </div>
  );
}
