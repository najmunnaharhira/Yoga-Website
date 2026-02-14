import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ClassCard({ cls }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition group"
    >
      <Link to={`/class/${cls._id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={cls.image}
            alt={cls.name}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-white text-sm">
            <span className="font-medium">{cls.instructorName}</span>
            <span>${cls.price}</span>
          </div>
        </div>
        <div className="p-4 bg-white">
          <h3 className="font-semibold text-lg line-clamp-1">{cls.name}</h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">{cls.description}</p>
          <div className="flex gap-4 mt-3 text-sm text-gray-600">
            <span>{cls.availableSeats} seats</span>
            <span>{cls.totalEnrolled || 0} enrolled</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
