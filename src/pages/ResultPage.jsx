
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, Award, BarChart2, Eye, Filter, Home, Download, Share2, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getAttemptById } from '@/lib/data/userAttempts';
import { getExamById, getQuestionsForExam } from '@/lib/data/examData';
import { useToast } from '@/components/ui/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [attempt, setAttempt] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const resultPageRef = useRef(null);
  
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

  const downloadResultAsPDF = () => {
    if (resultPageRef.current) {
      html2canvas(resultPageRef.current, { scale: 2, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0; // start image from top
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`MCQgram_Result_${exam?.name}_${attempt?.date}.pdf`);
        toast({ title: "Result Downloaded", description: "Your result has been downloaded as PDF." });
      }).catch(err => {
        console.error("Error generating PDF:", err);
        toast({ title: "Download Failed", description: "Could not generate PDF. Please try again.", variant: "destructive"});
      });
    }
  };
  
  if (!attempt || !exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
    if (!answer) return; // Should not happen if data is consistent
    if (!sectionPerformance[question.section]) {
      sectionPerformance[question.section] = { total: 0, correct: 0, incorrect: 0, unattempted: 0, marks: 0, totalMarksSection: 0 };
    }
    sectionPerformance[question.section].total++;
    sectionPerformance[question.section].totalMarksSection += exam.marksPerQuestion;
    if (!answer.selectedOption) {
      sectionPerformance[question.section].unattempted++;
    } else if (answer.isCorrect) {
      sectionPerformance[question.section].correct++;
      sectionPerformance[question.section].marks += exam.marksPerQuestion;
    } else {
      sectionPerformance[question.section].incorrect++;
      sectionPerformance[question.section].marks -= exam.negativeMarking;
    }
  });
  
  return (
    <div className="min-h-screen bg-gray-50 py-8" ref={resultPageRef}>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Button variant="ghost" onClick={() => navigate('/profile')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={downloadResultAsPDF}>
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/"> <Home className="mr-2 h-4 w-4" /> Home </Link>
            </Button>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-8">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{exam.name} - Test Result</h1>
                  <p className="text-gray-600">{exam.fullName}</p>
                </div>
                <div className="mt-4 md:mt-0 text-sm text-gray-500">
                  Date: {attempt.date}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="result-card bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Your Score</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-blue-700">{attempt.score}</span>
                    <span className="text-gray-600 ml-1.5">/ {attempt.totalMarks}</span>
                  </div>
                  <div className="mt-2.5">
                    <Progress value={scorePercentage} className="h-2" />
                    <p className="text-xs text-gray-600 mt-1.5">{Math.round(scorePercentage)}% score</p>
                  </div>
                </div>
                
                <div className="result-card bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-5 rounded-xl border border-green-100 shadow-sm">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Performance</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
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
                
                <div className="result-card bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-5 rounded-xl border border-yellow-100 shadow-sm">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Time Taken</h3>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-yellow-700">{attempt.timeTaken}</span>
                    <span className="text-gray-600 ml-1.5">/ {exam.duration} mins</span>
                  </div>
                  <div className="mt-2.5">
                    <Progress value={exam.duration > 0 ? (attempt.timeTaken / exam.duration) * 100 : 0} className="h-2 bg-yellow-200 [&>div]:bg-yellow-500" />
                    <p className="text-xs text-gray-600 mt-1.5">
                      {exam.duration > 0 ? Math.round((attempt.timeTaken / exam.duration) * 100) : 0}% of allowed time
                    </p>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="section-analysis">
                <TabsList className="mb-4 print:hidden">
                  <TabsTrigger value="section-analysis">Section Analysis</TabsTrigger>
                  <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
                </TabsList>
                
                <TabsContent value="section-analysis">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Section-wise Performance</h3>
                    <div className="space-y-5">
                      {Object.entries(sectionPerformance).map(([section, data]) => {
                        const sectionScorePercentage = data.totalMarksSection > 0 ? (data.marks / data.totalMarksSection) * 100 : 0;
                        return (
                          <div key={section} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                            <h4 className="font-medium mb-2">{section}</h4>
                            <div className="mb-2">
                              <Progress value={Math.max(0, sectionScorePercentage)} className="h-2" />
                              <div className="flex justify-between mt-1 text-xs text-gray-600">
                                <span>{Math.round(Math.max(0,sectionScorePercentage))}% Score</span>
                                <span>{data.marks} / {data.totalMarksSection} Marks</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                              <div className="bg-green-50 text-green-700 p-1.5 rounded">
                                <span className="font-semibold block">{data.correct}</span> Correct
                              </div>
                              <div className="bg-red-50 text-red-700 p-1.5 rounded">
                                <span className="font-semibold block">{data.incorrect}</span> Incorrect
                              </div>
                              <div className="bg-gray-100 text-gray-700 p-1.5 rounded">
                                <span className="font-semibold block">{data.unattempted}</span> Unattempted
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="ai-insights">
                  <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                    <div className="flex items-center mb-3">
                      <MessageCircle className="h-6 w-6 text-indigo-600 mr-3" />
                      <h3 className="text-lg font-semibold text-indigo-800">AI Performance Insights (Placeholder)</h3>
                    </div>
                    <p className="text-sm text-indigo-700 mb-2">
                      Based on your performance, here are some AI-generated suggestions:
                    </p>
                    <ul className="list-disc list-inside text-sm text-indigo-600 space-y-1">
                      <li>Focus more on {Object.keys(sectionPerformance)[0] || 'your weakest section'}.</li>
                      <li>Your accuracy in {Object.keys(sectionPerformance)[1] || 'another section'} is good, maintain it.</li>
                      <li>Try to improve time management for questions related to specific topics.</li>
                    </ul>
                    <Button variant="link" className="text-indigo-600 px-0 mt-2 text-sm print:hidden">Ask AI for more details (Feature coming soon)</Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4 print:hidden">
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
