import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, FileText, HelpCircle, Award, Landmark, Train, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { examCategories } from '@/lib/data/examData';
import { useToast } from '@/components/ui/use-toast';

const ExamListPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const categoryData = examCategories.find(cat => cat.id === category);
  
  React.useEffect(() => {
    if (!categoryData) {
      toast({
        title: "Category not found",
        description: "The exam category you're looking for doesn't exist.",
        variant: "destructive"
      });
      navigate('/categories');
    }
  }, [categoryData, toast, navigate]);

  if (!categoryData) {
    return null; 
  }

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
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('/categories')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`${categoryData.color} text-white p-4 rounded-lg inline-block mb-4`}>
              {categoryData.icon === 'FileText' && <FileText className="h-6 w-6" />}
              {categoryData.icon === 'Landmark' && <Landmark className="h-6 w-6" />}
              {categoryData.icon === 'Train' && <Train className="h-6 w-6" />}
              {categoryData.icon === 'Shield' && <Shield className="h-6 w-6" />}
            </div>
            <h1 className="text-3xl font-bold mb-2">{categoryData.name}</h1>
            <p className="text-gray-600 max-w-3xl">
              {categoryData.description}
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categoryData.exams.map((exam) => (
            <motion.div
              key={exam.id}
              variants={itemVariants}
              className="exam-card bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-1">{exam.name}</h2>
                <p className="text-gray-500 text-sm mb-4">{exam.fullName}</p>
                <p className="text-gray-600 mb-4">{exam.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">{exam.duration} mins</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">{exam.totalQuestions} questions</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">{exam.marksPerQuestion} marks each</span>
                  </div>
                  <div className="flex items-center">
                    <HelpCircle className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm">-{exam.negativeMarking} for wrong</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {exam.sections.map((section, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-700 text-xs py-1 px-2 rounded-full"
                    >
                      {section}
                    </span>
                  ))}
                </div>
                
                <Button 
                  className="w-full"
                  asChild
                >
                  <Link to={`/instructions/${exam.id}`}>
                    Start Mock Test
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ExamListPage;