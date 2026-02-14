import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../api/axios';
import ClassCard from '../components/ClassCard';
import InstructorCard from '../components/InstructorCard';

export default function Home() {
  const { data: classes = [] } = useQuery({
    queryKey: ['popular-classes'],
    queryFn: () => api.get('/popular_classes').then((r) => r.data),
  });

  const { data: instructors = [] } = useQuery({
    queryKey: ['popular-instructors'],
    queryFn: () => api.get('/popular-instructors').then((r) => r.data),
  });

  return (
    <div>
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-primary/20 via-white to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Transform Your Life with{' '}
              <span className="text-secondary">Yoga</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Learn yoga from expert instructors. Join thousands of students and discover the path to wellness.
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                to="/classes"
                className="px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:opacity-90 transition"
              >
                Browse Classes
              </Link>
              <Link
                to="/instructors"
                className="px-6 py-3 border-2 border-secondary text-secondary rounded-lg font-medium hover:bg-secondary hover:text-white transition"
              >
                Meet Instructors
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Popular Classes</h2>
          <p className="text-gray-600 mt-2">Most enrolled yoga classes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.slice(0, 6).map((cls) => (
            <ClassCard key={cls._id} cls={cls} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/classes"
            className="text-secondary font-medium hover:underline"
          >
            View All Classes →
          </Link>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Top Instructors</h2>
            <p className="text-gray-600 mt-2">Learn from the best</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.slice(0, 6).map((inst, i) => (
              <InstructorCard key={i} instructor={inst} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/instructors"
              className="text-secondary font-medium hover:underline"
            >
              View All Instructors →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
