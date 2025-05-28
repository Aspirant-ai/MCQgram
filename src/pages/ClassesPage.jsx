
import React from 'react';
import { motion } from 'framer-motion';
import { Video, PlayCircle, Clock, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const mockClasses = [
  {
    id: "class1",
    title: "Mastering Quantitative Aptitude for SSC CGL",
    instructor: "Mr. Sharma",
    date: "Every Monday, 7 PM",
    duration: "90 Mins",
    enrolled: 150,
    category: "SSC",
    thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b25saW5lJTIwY2xhc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "class2",
    title: "Complete English Grammar for Banking Exams",
    instructor: "Ms. Verma",
    date: "Starts June 1st, 2025",
    duration: "60 Mins / Session",
    enrolled: 220,
    category: "Banking",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZWR1Y2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: "class3",
    title: "Reasoning Tricks for RRB NTPC",
    instructor: "Mr. Kumar",
    date: "Weekend Batch",
    duration: "120 Mins",
    enrolled: 95,
    category: "Railway",
    thumbnail: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRlYWNoaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  }
];

const ClassesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-5xl"
      >
        <div className="text-center mb-12">
          <Video className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Our Classes</h1>
          <p className="text-lg text-gray-600">Join live and recorded classes by expert educators to boost your preparation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockClasses.map((cls) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 flex flex-col hover:shadow-2xl transition-shadow"
            >
              <div className="relative">
                <img  src={cls.thumbnail} alt={cls.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <PlayCircle className="h-16 w-16 text-white/80 hover:text-white transition-colors cursor-pointer" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-primary mb-1">{cls.category}</span>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex-grow">{cls.title}</h3>
                <p className="text-sm text-gray-600 mb-1">By {cls.instructor}</p>
                
                <div className="text-xs text-gray-500 space-y-1 my-3">
                  <div className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1.5" /> {cls.date}</div>
                  <div className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1.5" /> {cls.duration}</div>
                  <div className="flex items-center"><Users className="h-3.5 w-3.5 mr-1.5" /> {cls.enrolled} Enrolled</div>
                </div>
                
                <Button asChild className="w-full mt-auto">
                  <Link to={`/classes/${cls.id}`}>View Details</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-gray-500 mt-12 text-sm">
          Explore more classes and find the perfect one for your exam preparation journey.
        </p>
      </motion.div>
    </div>
  );
};

export default ClassesPage;
