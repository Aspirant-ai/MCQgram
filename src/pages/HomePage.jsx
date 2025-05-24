import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Award, BarChart2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserAttempts } from '@/lib/data/userAttempts'; 

const HomePage = () => {
  const userAttempts = getUserAttempts();
  const recentAttempts = userAttempts.slice(0, 3);

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Ace Your Competitive Exams with Confidence
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Practice with realistic mock tests for SSC, Banking, Railway, and other competitive exams. Track your progress and improve your scores.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100"
                  asChild
                >
                  <Link to="/categories">
                    Start Practicing <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 focus:bg-white/10 focus:text-white"
                  asChild
                >
                  <Link to="/profile">
                    View Your Progress
                  </Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="glass-card rounded-xl p-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500 rounded-full opacity-20"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500 rounded-full opacity-20"></div>
                <img  alt="Students preparing for competitive exams" className="rounded-lg w-full" src="https://images.unsplash.com/photo-1620837913485-75ec3d6fea99" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose MCQgram?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to help you prepare effectively for competitive exams with realistic mock tests and comprehensive analytics.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Diverse Exam Categories</h3>
              <p className="text-gray-600">
                Practice with mock tests for SSC, Banking, Railway, and other competitive exams all in one place.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Timed Mock Tests</h3>
              <p className="text-gray-600">
                Experience real exam conditions with timed tests that simulate the actual exam environment.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">
                Get comprehensive performance reports to identify your strengths and areas for improvement.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Recent Activity Section */}
      {recentAttempts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Your Recent Activity</h2>
              <Link to="/profile" className="text-primary flex items-center hover:underline">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentAttempts.map((attempt, index) => (
                <motion.div
                  key={attempt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{attempt.examId.toUpperCase()}</h3>
                        <p className="text-gray-500 text-sm">{attempt.date}</p>
                      </div>
                      <div className="bg-blue-50 text-blue-600 font-medium text-sm py-1 px-3 rounded-full">
                        {Math.round((attempt.score / attempt.totalMarks) * 100)}%
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Award className="h-4 w-4 mr-1" />
                        <span>Score: {attempt.score}/{attempt.totalMarks}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{attempt.timeTaken} mins</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link 
                        to={`/result/${attempt.id}`}
                        className="text-primary text-sm font-medium hover:underline flex items-center"
                      >
                        View Details <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Exam Preparation?</h2>
              <p className="text-gray-300 mb-8">
                Start practicing with our mock tests today and take a step closer to achieving your goals.
              </p>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                asChild
              >
                <Link to="/categories">
                  Start Practicing Now <CheckCircle2 className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;