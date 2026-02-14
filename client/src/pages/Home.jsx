import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { getFallbackClasses, getFallbackInstructors } from '../api/fallback';
import ClassCard from '../components/ClassCard';
import InstructorCard from '../components/InstructorCard';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920';

export default function Home() {
  const { data: classes = [], isError: classesError } = useQuery({
    queryKey: ['popular-classes'],
    queryFn: () =>
      api
        .get('/popular_classes')
        .then((r) => r.data)
        .catch(() => getFallbackClasses()),
    retry: false,
  });

  const { data: instructors = [], isError: instructorsError } = useQuery({
    queryKey: ['popular-instructors'],
    queryFn: () =>
      api
        .get('/popular-instructors')
        .then((r) => r.data)
        .catch(() => getFallbackInstructors()),
    retry: false,
  });

  return (
    <div>
      {/* Hero Section - extends behind navbar */}
      <section className="relative min-h-screen flex items-center -mt-20 pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="text-white/90 text-sm font-medium tracking-widest uppercase mb-2">
              WE PROVIDES
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Best Yoga
              <br />
              Online
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-xl leading-relaxed">
              Offered chiefly farther of my no colonel shyness. Such on help ye some door if in.
              Laughter proposal laughing any son law consider.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
              >
                JOIN TODAY
              </Link>
              <Link
                to="/classes"
                className="px-8 py-4 border-2 border-white text-white hover:bg-white/10 font-semibold rounded-lg transition"
              >
                VIEW COURSES
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Classes */}
      <section className="py-16 max-w-7xl mx-auto px-4 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Popular Classes</h2>
          <p className="text-gray-600 mt-2">Most enrolled yoga classes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classesError && classes.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-8">Unable to load classes. Make sure the server is running.</p>
          ) : (
            classes.slice(0, 6).map((cls) => (
              <ClassCard key={cls._id} cls={cls} />
            ))
          )}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/classes"
            className="text-blue-500 font-medium hover:underline"
          >
            View All Classes →
          </Link>
        </div>
      </section>

      {/* Top Instructors */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Top Instructors</h2>
            <p className="text-gray-600 mt-2">Learn from the best</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorsError && instructors.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-8">Unable to load instructors. Start the server to load live data.</p>
            ) : (
              instructors.slice(0, 6).map((inst, i) => (
                <InstructorCard key={i} instructor={inst} />
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/instructors"
              className="text-blue-500 font-medium hover:underline"
            >
              View All Instructors →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
