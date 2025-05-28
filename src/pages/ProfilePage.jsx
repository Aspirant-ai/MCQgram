import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Clock, 
  Award, 
  Calendar, 
  ArrowRight,
  Search,
  SlidersHorizontal,
  FileText,
  Landmark,
  Train,
  Shield,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserAttempts } from '@/lib/data/userAttempts';
import { getExamById, examCategories } from '@/lib/data/examData';

const ProfilePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const userAttempts = getUserAttempts();
  
  const sortedAttempts = [...userAttempts].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  const filteredAttempts = sortedAttempts.filter(attempt => {
    const exam = getExamById(attempt.examId);
    if (!exam) return false; 
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exam.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || exam.categoryId === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  const totalAttempts = userAttempts.length;
  const totalQuestions = userAttempts.reduce((acc, attempt) => acc + attempt.answers.length, 0);
  const correctAnswers = userAttempts.reduce((acc, attempt) => 
    acc + attempt.answers.filter(a => a.isCorrect).length, 0);
  
  const averageScore = totalAttempts > 0 
    ? userAttempts.reduce((acc, attempt) => acc + (attempt.totalMarks > 0 ? (attempt.score / attempt.totalMarks) * 100 : 0), 0) / totalAttempts 
    : 0;
  
  const categoryPerformance = {};
  
  userAttempts.forEach(attempt => {
    const exam = getExamById(attempt.examId);
    if (!exam) return;
    
    const categoryId = exam.categoryId;
    
    if (!categoryPerformance[categoryId]) {
      categoryPerformance[categoryId] = {
        totalScore: 0,
        totalMarks: 0,
        attempts: 0,
        categoryName: exam.categoryName
      };
    }
    
    categoryPerformance[categoryId].totalScore += attempt.score;
    categoryPerformance[categoryId].totalMarks += attempt.totalMarks;
    categoryPerformance[categoryId].attempts += 1;
  });
  
  Object.keys(categoryPerformance).forEach(categoryId => {
    const category = categoryPerformance[categoryId];
    category.percentage = category.totalMarks > 0 ? (category.totalScore / category.totalMarks) * 100 : 0;
  });
  
  const iconMap = {
    'ssc': <FileText className="h-5 w-5" />,
    'bank': <Landmark className="h-5 w-5" />,
    'railway': <Train className="h-5 w-5" />,
    'defence': <Shield className="h-5 w-5" />
  };
  
  const colorMap = {
    'ssc': 'bg-blue-500',
    'bank': 'bg-green-500',
    'railway': 'bg-red-500',
    'defence': 'bg-yellow-500'
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8"
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <Avatar className="h-20 w-20 md:mr-6 mb-4 md:mb-0">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold mb-2">John Doe</h1>
                <p className="text-gray-600 mb-4">john.doe@example.com</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tests Taken</p>
                      <p className="font-semibold">{totalAttempts}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Avg. Score</p>
                      <p className="font-semibold">{Math.round(averageScore)}%</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <BarChart2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Accuracy</p>
                      <p className="font-semibold">
                        {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="all-tests">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <TabsList>
                  <TabsTrigger value="all-tests">All Tests</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 md:mt-0 flex items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tests..."
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="ml-2 relative">
                    <select
                      className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      {examCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <TabsContent value="all-tests">
                {filteredAttempts.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tests found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || categoryFilter !== 'all' 
                        ? "No tests match your search criteria. Try adjusting your filters."
                        : "You haven't taken any tests yet. Start practicing to see your results here."}
                    </p>
                    <Button asChild>
                      <Link to="/categories">
                        Start Practicing
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAttempts.map((attempt) => {
                      const exam = getExamById(attempt.examId);
                      if (!exam) return null;
                      
                      const scorePercentage = attempt.totalMarks > 0 ? (attempt.score / attempt.totalMarks) * 100 : 0;
                      
                      return (
                        <motion.div
                          key={attempt.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start">
                            <div className={`${colorMap[exam.categoryId] || 'bg-gray-500'} text-white p-3 rounded-lg mr-4`}>
                              {iconMap[exam.categoryId] || <FileText className="h-5 w-5" />}
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-lg">{exam.name}</h3>
                                  <p className="text-gray-500 text-sm">{exam.fullName}</p>
                                </div>
                                <div className="bg-blue-50 text-blue-600 font-medium text-sm py-1 px-3 rounded-full">
                                  {Math.round(scorePercentage)}%
                                </div>
                              </div>
                              
                              <div className="mt-3 mb-4">
                                <Progress value={scorePercentage} className="h-2" />
                              </div>
                              
                              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Award className="h-4 w-4 mr-1" />
                                  <span>Score: {attempt.score}/{attempt.totalMarks}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>Time: {attempt.timeTaken} mins</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>Date: {attempt.date}</span>
                                </div>
                                <div className="ml-auto">
                                  <Link 
                                    to={`/result/${attempt.id}`}
                                    className="text-primary font-medium hover:underline flex items-center"
                                  >
                                    View Details <ArrowRight className="ml-1 h-3 w-3" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="analytics">
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Overall Performance</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center mb-2">
                        <Award className="h-5 w-5 text-blue-600 mr-2" />
                        <h4 className="font-medium">Average Score</h4>
                      </div>
                      <p className="text-3xl font-bold text-blue-700">{Math.round(averageScore)}%</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-medium">Accuracy</h4>
                      </div>
                      <p className="text-3xl font-bold text-green-700">
                        {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center mb-2">
                        <FileText className="h-5 w-5 text-purple-600 mr-2" />
                        <h4 className="font-medium">Tests Completed</h4>
                      </div>
                      <p className="text-3xl font-bold text-purple-700">{totalAttempts}</p>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-3">Category-wise Performance</h4>
                  
                  {Object.keys(categoryPerformance).length === 0 ? (
                    <p className="text-gray-500 text-sm">No data available yet. Take some tests to see your performance.</p>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(categoryPerformance).map(([categoryId, data]) => (
                        <div key={categoryId} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <div className={`${colorMap[categoryId] || 'bg-gray-500'} text-white p-2 rounded-md mr-3`}>
                              {iconMap[categoryId] || <FileText className="h-4 w-4" />}
                            </div>
                            <h5 className="font-medium">{data.categoryName}</h5>
                            <span className="ml-auto text-sm text-gray-600">
                              {data.attempts} test{data.attempts !== 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          <div className="mt-2">
                            <Progress value={data.percentage} className="h-2" />
                            <div className="flex justify-between mt-1">
                              <span className="text-sm font-medium">
                                {Math.round(data.percentage)}%
                              </span>
                              <span className="text-sm text-gray-600">
                                {data.totalScore} / {data.totalMarks}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <Link to="/categories">
                      <FileText className="mr-2 h-4 w-4" /> Take a New Test
                    </Link>
                  </Button>
                  
                  {userAttempts.length > 0 && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to={`/result/${sortedAttempts[0].id}`}>
                        <BarChart2 className="mr-2 h-4 w-4" /> View Latest Result
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Popular Exams</h3>
                <div className="space-y-4">
                  {examCategories.slice(0, 2).map(category => (
                    <div key={category.id}>
                      <h4 className="font-medium text-gray-700 mb-2">{category.name}</h4>
                      <div className="space-y-2">
                        {category.exams.slice(0, 3).map(exam => (
                          <Link 
                            key={exam.id}
                            to={`/instructions/${exam.id}`}
                            className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className={`${colorMap[category.id]} text-white p-2 rounded-md mr-3`}>
                              {iconMap[category.id]}
                            </div>
                            <div>
                              <p className="font-medium">{exam.name}</p>
                              <p className="text-sm text-gray-500">{exam.fullName}</p>
                            </div>
                            <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;