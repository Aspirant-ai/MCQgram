
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Award, BarChart2, Zap, Users, GraduationCap, CheckCircle, TrendingUp, ExternalLink, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getUserAttempts } from '@/lib/data/userAttempts';
import { getExamById, examCategories } from '@/lib/data/examData';

const StatCard = ({ title, value, icon, color, link, linkText }) => (
  <motion.div 
    className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow`}
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center mb-3">
      <div className={`p-3 rounded-full mr-4 ${color}`}>
        {React.cloneElement(icon, { className: "h-6 w-6 text-white" })}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
    {link && (
      <Link to={link} className="text-sm text-primary dark:text-primary-light font-medium hover:underline flex items-center">
        {linkText || "View Details"} <ArrowRight className="ml-1 h-3 w-3" />
      </Link>
    )}
  </motion.div>
);

const RecentAttemptCard = ({ attempt, examDetails, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
  >
    <div className="p-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{examDetails?.name || attempt.examId.toUpperCase()}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{new Date(attempt.date).toLocaleDateString()}</p>
        </div>
        <div className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light font-medium text-sm py-1 px-3 rounded-full">
          {attempt.totalMarks > 0 ? Math.round((attempt.score / attempt.totalMarks) * 100) : 0}%
        </div>
      </div>
      <Progress value={attempt.totalMarks > 0 ? (attempt.score / attempt.totalMarks) * 100 : 0} className="h-2 mb-3" />
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <Award className="h-4 w-4 mr-1" />
          Score: {attempt.score}/{attempt.totalMarks}
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {attempt.timeTaken} mins
        </div>
      </div>
      <Link 
        to={`/result/${attempt.id}`}
        className="text-primary dark:text-primary-light text-sm font-medium hover:underline flex items-center mt-4"
      >
        View Report <ArrowRight className="ml-1 h-3 w-3" />
      </Link>
    </div>
  </motion.div>
);

const QuickLinkCard = ({ title, icon, path, description, color }) => (
    <Link to={path}>
        <motion.div 
            className={`bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow h-full flex flex-col`}
            whileHover={{ y: -5 }}
        >
            <div className="flex items-center mb-3">
                 <div className={`p-2.5 rounded-lg mr-3 ${color}`}>
                    {React.cloneElement(icon, { className: "h-5 w-5 text-white" })}
                </div>
                <h3 className="text-md font-semibold text-gray-800 dark:text-white">{title}</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex-grow">{description}</p>
            <div className="text-sm text-primary dark:text-primary-light font-medium flex items-center mt-auto">
                Go to {title} <ArrowRight className="ml-1 h-3 w-3" />
            </div>
        </motion.div>
    </Link>
);


const DashboardHomePage = () => {
  const userAttempts = getUserAttempts();
  const recentAttempts = userAttempts.sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  const totalTestsTaken = userAttempts.length;
  
  const totalScore = userAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const totalMaxMarks = userAttempts.reduce((sum, attempt) => sum + attempt.totalMarks, 0);
  const averagePercentage = totalMaxMarks > 0 ? Math.round((totalScore / totalMaxMarks) * 100) : 0;

  // Placeholder for "active" or "upcoming" live tests count
  const liveTestsCount = 2; 

  const quickLinks = [
    { title: "All Exams", icon: <BookOpen />, path: "/dashboard/categories", description: "Browse and start mock tests from various categories.", color: "bg-blue-500" },
    { title: "Live Tests", icon: <Zap />, path: "/dashboard/live-tests", description: "Participate in real-time tests and compete.", color: "bg-red-500" },
    { title: "Study Material", icon: <GraduationCap />, path: "/dashboard/study-material", description: "Access PYQs, notes, and other resources.", color: "bg-green-500" },
    { title: "Performance", icon: <BarChart2 />, path: "/dashboard/profile", description: "Track your progress and analyze attempts.", color: "bg-purple-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-0">Welcome, John!</h1>
        <Button asChild>
          <Link to="/dashboard/categories">
            Start a New Test <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Tests Taken" value={totalTestsTaken} icon={<Activity />} color="bg-blue-500" link="/dashboard/profile" />
        <StatCard title="Average Score" value={`${averagePercentage}%`} icon={<TrendingUp />} color="bg-green-500" link="/dashboard/profile" />
        <StatCard title="Live Tests Available" value={liveTestsCount} icon={<Zap />} color="bg-red-500" link="/dashboard/live-tests" />
        <StatCard title="Study Materials" value="150+" icon={<GraduationCap />} color="bg-yellow-500" link="/dashboard/study-material" />
      </div>
      
      {/* Quick Links Section */}
       <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => (
            <QuickLinkCard key={link.title} {...link} />
          ))}
        </div>
      </div>


      {/* Recent Activity Section */}
      {recentAttempts.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Recent Activity</h2>
            <Link to="/dashboard/profile" className="text-sm text-primary dark:text-primary-light font-medium hover:underline flex items-center">
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentAttempts.map((attempt, index) => {
              const examDetails = getExamById(attempt.examId);
              return <RecentAttemptCard key={attempt.id} attempt={attempt} examDetails={examDetails} index={index} />;
            })}
          </div>
        </div>
      )}

      {/* Call to Action / Next Steps */}
      <div className="mt-8 bg-gradient-to-r from-primary to-purple-600 dark:from-primary-dark dark:to-purple-700 text-white p-8 rounded-xl shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready for your next challenge?</h2>
            <p className="text-purple-100 dark:text-purple-200 mb-4 md:mb-0">
              Keep practicing to improve your scores and achieve your exam goals.
            </p>
          </div>
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100 dark:bg-gray-100 dark:text-primary dark:hover:bg-gray-200" asChild>
            <Link to="/dashboard/categories">
              Explore All Mock Tests <BookOpen className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHomePage;
