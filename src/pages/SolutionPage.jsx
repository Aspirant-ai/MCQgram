import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, EyeOff, Eye, Home, Languages, Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getAttemptById } from '@/lib/data/userAttempts';
import { getExamById, getQuestionsForExam } from '@/lib/data/examData';
import { useToast } from '@/components/ui/use-toast';

const SolutionPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [attempt, setAttempt] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [language, setLanguage] = useState('en');
  const [filter, setFilter] = useState('all');
  const [filteredQuestionsIndices, setFilteredQuestionsIndices] = useState([]);

  useEffect(() => {
    const attemptData = getAttemptById(attemptId);
    if (!attemptData) {
      toast({
        title: "Attempt not found",
        description: "The test attempt you're looking for doesn't exist.",
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
    setFilteredQuestionsIndices(questionsData.map((_, index) => index)); 
  }, [attemptId, toast, navigate]);

  useEffect(() => {
    if (questions.length > 0 && attempt) {
      let indices = questions.map((_, index) => index);
      if (filter === 'correct') {
        indices = indices.filter(index => attempt.answers[index]?.isCorrect);
      } else if (filter === 'incorrect') {
        indices = indices.filter(index => attempt.answers[index]?.selectedOption && !attempt.answers[index]?.isCorrect);
      } else if (filter === 'unattempted') {
        indices = indices.filter(index => !attempt.answers[index]?.selectedOption);
      }
      setFilteredQuestionsIndices(indices);
      setCurrentQuestionIndex(indices.length > 0 ? indices[0] : 0); 
    }
  }, [filter, questions, attempt]);

  if (!attempt || !exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading solutions...</p>
        </div>
      </div>
    );
  }
  
  const currentFilteredIndex = filteredQuestionsIndices.indexOf(currentQuestionIndex);
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = attempt.answers.find(a => a.questionId === currentQuestion.id);

  const goToNextQuestion = () => {
    if (currentFilteredIndex < filteredQuestionsIndices.length - 1) {
      setCurrentQuestionIndex(filteredQuestionsIndices[currentFilteredIndex + 1]);
    }
  };
  
  const goToPrevQuestion = () => {
    if (currentFilteredIndex > 0) {
      setCurrentQuestionIndex(filteredQuestionsIndices[currentFilteredIndex - 1]);
    }
  };

  const displayQuestion = language === 'hi' && currentQuestion.question_hi ? currentQuestion.question_hi : currentQuestion.question;
  const displayOptions = currentQuestion.options.map(opt => ({
    ...opt,
    text: language === 'hi' && opt.text_hi ? opt.text_hi : opt.text
  }));
  const displayExplanation = language === 'hi' && currentQuestion.explanation_hi ? currentQuestion.explanation_hi : currentQuestion.explanation;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-md py-3 px-4 md:px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg md:text-xl font-bold">{exam.name} - Solutions</h1>
            <p className="text-gray-600 text-xs md:text-sm">{exam.fullName}</p>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate(`/result/${attemptId}`)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Result
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/"> <Home className="h-4 w-4 mr-1" /> Home </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <div className="flex-grow p-4 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 max-w-4xl mx-auto">
            {filteredQuestionsIndices.length === 0 ? (
              <div className="text-center py-10">
                <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No questions match the current filter.</p>
              </div>
            ) : (
            <>
              <div className="flex justify-between items-center mb-3">
                <span className="bg-primary text-white text-xs md:text-sm font-medium py-1 px-2 md:px-3 rounded-full">
                  Question {currentQuestionIndex + 1} of {questions.length} 
                  {filter !== 'all' && ` (Filtered: ${currentFilteredIndex + 1}/${filteredQuestionsIndices.length})`}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Section: {currentQuestion.section}</span>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[100px] h-8 text-xs">
                      <SelectValue placeholder="Lang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mb-6 min-h-[100px]">
                <h2 className="text-base md:text-lg font-medium mb-4">{displayQuestion}</h2>
                <div className="space-y-3">
                  {displayOptions.map((option) => {
                    let optionClass = "border-gray-200";
                    let icon = null;

                    if (option.id === currentQuestion.correctAnswer) {
                      optionClass = "border-green-500 bg-green-50";
                      icon = <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />;
                    }
                    if (currentAnswer?.selectedOption === option.id) {
                      if (!currentAnswer.isCorrect) {
                        optionClass = "border-red-500 bg-red-50";
                        icon = <XCircle className="h-5 w-5 text-red-600 ml-auto" />;
                      } else {
                         icon = <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />;
                      }
                    }
                    
                    return (
                      <div key={option.id} className={`flex items-center p-3 rounded-lg border ${optionClass}`}>
                        <span className="font-medium mr-2">{option.id.toUpperCase()}.</span>
                        <span className="text-sm md:text-base flex-grow">{option.text}</span>
                        {icon}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <h3 className="text-sm font-semibold text-blue-800 mb-1">Explanation:</h3>
                <p className="text-sm text-blue-700">{displayExplanation}</p>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mb-6">
                <h3 className="text-sm font-semibold text-indigo-800 mb-2">Performance Insights (Mock Data):</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-indigo-600"/> 
                        <span>Your Time: {Math.floor(Math.random() * 60) + 20}s</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-indigo-600"/> 
                        <span>Avg. Time: {Math.floor(Math.random() * 40) + 30}s</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-indigo-600"/> 
                        <span>Topper's Time: {Math.floor(Math.random() * 20) + 15}s</span>
                    </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={goToPrevQuestion}
                  disabled={currentFilteredIndex === 0}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                </Button>
                <Button 
                  size="sm"
                  onClick={goToNextQuestion}
                  disabled={currentFilteredIndex === filteredQuestionsIndices.length - 1}
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </>
            )}
          </div>
        </div>
        
        <div className="bg-white border-t md:border-t-0 md:border-l border-gray-200 p-3 md:w-72 lg:w-80 flex-shrink-0 overflow-y-auto">
          <div className="mb-3">
            <h3 className="font-medium text-sm mb-2">Filter Questions</h3>
            <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full h-9 text-xs">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Questions</SelectItem>
                    <SelectItem value="correct">Correct</SelectItem>
                    <SelectItem value="incorrect">Incorrect</SelectItem>
                    <SelectItem value="unattempted">Unattempted</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="mb-3">
            <h3 className="font-medium text-sm mb-2">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((question, index) => {
                  const ans = attempt.answers.find(a => a.questionId === question.id);
                  let statusClass = "bg-gray-200 hover:bg-gray-300";
                  if (ans?.selectedOption) {
                      statusClass = ans.isCorrect ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white";
                  }
                  if (!filteredQuestionsIndices.includes(index) && filter !== 'all') {
                    statusClass += " opacity-50";
                  }

                return (
                  <button
                    key={question.id}
                    className={`p-1.5 rounded text-xs text-center transition-colors ${statusClass} ${currentQuestionIndex === index ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                    onClick={() => {
                      if(filteredQuestionsIndices.includes(index) || filter === 'all'){
                         setCurrentQuestionIndex(index);
                         if(filter !== 'all' && !filteredQuestionsIndices.includes(index)) setFilter('all');
                      }
                    }}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionPage;