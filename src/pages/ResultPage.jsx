import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, Award, BarChart2, Eye, Filter, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAttemptById } from '@/lib/data/userAttempts';
import { getExamById, getQuestionsForExam } from '@/lib/data/examData';
import { useToast } from '@/components/ui/use-toast';

const ResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [attempt, setAttempt] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  useEffect(() => {
    const attemptData = getAttemptById(attemptId);
    if (!attemptData) {
      toast({
        title: "Result not found",
        description: "The test result you're looking for doesn't exist.",
        variant: "destructive"
      });
      navigate('/profile');
      return;
    }
    setAttempt(attemptData);
    
    const examData = getExamById(attemptData.examId);
    setExam(examData);
    
    const questionsData = getQuestionsForExam(attemptData.examId);
    setQuestions(questionsData);
  }, [attemptId, toast, navigate]);
  
  if (!attempt || !exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading result...</p>
        </div>
      </div>
    );
  }
  
  const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
  const incorrectAnswers = attempt.answers.filter(a => a.selectedOption && !a.isCorrect).length;
  const unattemptedQuestions = attempt.answers.filter(a => !a.selectedOption).length;
  const scorePercentage = attempt.totalMarks > 0 ? (attempt.score / attempt.totalMarks) * 100 : 0;
  
  const sectionPerformance = {};
  questions.forEach(question => {
    const answer = attempt.answers.find(a => a.questionId === question.id);
    if (!answer) return;
    if (!sectionPerformance[question.section]) {
      sectionPerformance[question.section] = { total: 0, correct: 0, incorrect: 0, unattempted: 0 };
    }
    sectionPerformance[question.section].total++;
    if (!answer.selectedOption) sectionPerformance[question.section].unattempted++;
    else if (answer.isCorrect) sectionPerformance[question.section].correct++;
    else sectionPerformance[question.section].incorrect++;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/profile')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Button>
          <Button variant="outline" asChild>
            <Link to="/"> <Home className="mr-2 h-4 w-4" /> Home </Link>
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{exam.name} - Test Result</h1>
                  <p className="text-gray-600">{exam.fullName}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="text-sm text-gray-500">Date: {attempt.date}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="result-card bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-3">
                    <Award className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Your Score</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-blue-700">{attempt.score}</span>
                    <span className="text-gray-600 ml-2">/ {attempt.totalMarks}</span>
                  </div>
                  <div className="mt-3">
                    <Progress value={scorePercentage} className="h-2" />
                    <p className="text-sm text-gray-600 mt-2">{Math.round(scorePercentage)}% score</p>
                  </div>
                </div>
                
                <div className="result-card bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Performance</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <span className="text-2xl font-bold text-green-600">{correctAnswers}</span>
                      <p className="text-xs text-gray-600">Correct</p>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-red-500">{incorrectAnswers}</span>
                      <p className="text-xs text-gray-600">Incorrect</p>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-gray-500">{unattemptedQuestions}</span>
                      <p className="text-xs text-gray-600">Unattempted</p>
                    </div>
                  </div>
                </div>
                
                <div className="result-card bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                  <div className="flex items-center mb-3">
                    <Clock className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Time Taken</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-purple-700">{attempt.timeTaken}</span>
                    <span className="text-gray-600 ml-2">/ {exam.duration} mins</span>
                  </div>
                  <div className="mt-3">
                    <Progress value={exam.duration > 0 ? (attempt.timeTaken / exam.duration) * 100 : 0} className="h-2" />
                    <p className="text-sm text-gray-600 mt-2">
                      {exam.duration > 0 ? Math.round((attempt.timeTaken / exam.duration) * 100) : 0}% of allowed time
                    </p>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="section">
                <TabsList className="mb-6">
                  <TabsTrigger value="section">Section Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="section">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Section-wise Performance</h3>
                    <div className="space-y-6">
                      {Object.entries(sectionPerformance).map(([section, data]) => {
                        const sectionScorePercentage = data.total > 0 ? (data.correct / data.total) * 100 : 0;
                        return (
                          <div key={section} className="bg-white p-4 rounded-lg border border-gray-100">
                            <h4 className="font-medium mb-3">{section}</h4>
                            <div className="mb-3">
                              <Progress value={sectionScorePercentage} className="h-2" />
                              <div className="flex justify-between mt-1 text-sm text-gray-600">
                                <span>{Math.round(sectionScorePercentage)}%</span>
                                <span>{data.correct} / {data.total} correct</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                              <div className="bg-green-50 text-green-700 py-2 rounded">
                                <span className="font-semibold">{data.correct}</span> Correct
                              </div>
                              <div className="bg-red-50 text-red-700 py-2 rounded">
                                <span className="font-semibold">{data.incorrect}</span> Incorrect
                              </div>
                              <div className="bg-gray-50 text-gray-700 py-2 rounded">
                                <span className="font-semibold">{data.unattempted}</span> Unattempted
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
                <Button variant="outline" asChild>
                  <Link to={`/solution/${attempt.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> View Detailed Solutions
                  </Link>
                </Button>
                <Button asChild>
                  <Link to={`/instructions/${exam.id}`}>
                    Take Test Again
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultPage;