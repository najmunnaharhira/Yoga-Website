import { motion } from 'framer-motion';

export default function InstructorCard({ instructor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition"
    >
      <img
        src={instructor.photoUrl || instructor.instructor?.photoUrl || '/logo.png'}
        alt={instructor.name || instructor.instructor?.name}
        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary/30"
        onError={(e) => (e.target.src = '/logo.png')}
      />
      <h3 className="font-semibold text-lg mt-3">
        {instructor.name || instructor.instructor?.name || 'Instructor'}
      </h3>
      <p className="text-gray-500 text-sm">
        {instructor.totalEnrolled || 0} students enrolled
      </p>
    </motion.div>
  );
}
