import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { getFallbackClasses } from '../api/fallback';
import ClassCard from '../components/ClassCard';

export default function Classes() {
  const { data: classes = [], isLoading, isError } = useQuery({
    queryKey: ['classes'],
    queryFn: () =>
      api
        .get('/classes')
        .then((r) => r.data)
        .catch(() => getFallbackClasses()),
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
        <h1 className="text-4xl font-bold text-gray-900">All Classes</h1>
        <p className="text-gray-600 mt-2">Choose your yoga journey</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <ClassCard key={cls._id} cls={cls} />
        ))}
      </div>
      {classes.length === 0 && (
        <p className="text-center text-gray-500 py-12 col-span-full">
          {isError ? 'Unable to load classes. Start the server or check the API URL.' : 'No classes available yet.'}
        </p>
      )}
    </div>
  );
}
