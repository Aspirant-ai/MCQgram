import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Landmark, Train, Shield, ArrowRight } from 'lucide-react';
import { examCategories } from '@/lib/data/examData'; 

const ExamCategoriesPage = () => {
  const iconMap = {
    FileText: <FileText className="h-6 w-6" />,
    Landmark: <Landmark className="h-6 w-6" />,
    Train: <Train className="h-6 w-6" />,
    Shield: <Shield className="h-6 w-6" />
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl font-bold mb-4">Exam Categories</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from a wide range of competitive exam categories. Each category contains multiple mock tests to help you prepare effectively.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {examCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="exam-card bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className={`${category.color} text-white p-3 rounded-lg mr-4`}>
                    {iconMap[category.icon]}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {category.exams.map((exam) => (
                        <span 
                          key={exam.id} 
                          className="bg-gray-100 text-gray-700 text-sm py-1 px-3 rounded-full"
                        >
                          {exam.name}
                        </span>
                      ))}
                    </div>
                    <Link 
                      to={`/exams/${category.id}`}
                      className="text-primary font-medium flex items-center hover:underline"
                    >
                      View Exams <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ExamCategoriesPage;