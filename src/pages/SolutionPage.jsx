
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, Home, Languages, Filter, ChevronLeft, ChevronRight, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      toast({ title: "Attempt not found", variant: "destructive" });
      navigate('/profile');
      return;
    }
    setAttempt(attemptData);
    
    const examData = getExamById(attemptData.examId);
    setExam(examData);
    
    const questionsData = getQuestionsForExam(attemptData.examId);
    setQuestions(questionsData);
  }, [attemptId, toast, navigate]);

  useEffect(() => {
    if (questions.length > 0 && attempt) {
      let indices = questions.map((q, index) => index); // Store original indices
      if (filter === 'correct') {
        indices = indices.filter(index => attempt.answers.find(a => a.questionId === questions[index].id)?.isCorrect);
      } else if (filter === 'incorrect') {
        indices = indices.filter(index => {
          const ans = attempt.answers.find(a => a.questionId === questions[index].id);
          return ans?.selectedOption && !ans.isCorrect;
        });
      } else if (filter === 'unattempted') {
        indices = indices.filter(index => !attempt.answers.find(a => a.questionId === questions[index].id)?.selectedOption);
      }
      setFilteredQuestionsIndices(indices);
      // Set currentQuestionIndex to the first item of the new filtered list, or 0 if empty
      setCurrentQuestionIndex(indices.length > 0 ? indices[0] : 0); 
    }
  }, [filter, questions, attempt]);

  if (!attempt || !exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const actualCurrentQuestionIndex = filteredQuestionsIndices.length > 0 ? filteredQuestionsIndices.indexOf(currentQuestionIndex) : -1;
  const currentQuestion = questions[currentQuestionIndex]; // Always use original index for data
  const currentAnswer = currentQuestion ? attempt.answers.find(a => a.questionId === currentQuestion.id) : null;

  const goToNextFilteredQuestion = () => {
    if (actualCurrentQuestionIndex < filteredQuestionsIndices.length - 1) {
      setCurrentQuestionIndex(filteredQuestionsIndices[actualCurrentQuestionIndex + 1]);
    }
  };
  
  const goToPrevFilteredQuestion = () => {
    if (actualCurrentQuestionIndex > 0) {
      setCurrentQuestionIndex(filteredQuestionsIndices[actualCurrentQuestionIndex - 1]);
    }
  };

  const displayQuestion = currentQuestion && (language === 'hi' && currentQuestion.question_hi ? currentQuestion.question_hi : currentQuestion.question);
  const displayOptions = currentQuestion ? currentQuestion.options.map(opt => ({
    ...opt,
    text: language === 'hi' && opt.text_hi ? opt.text_hi : opt.text
  })) : [];
  const displayExplanation = currentQuestion && (language === 'hi' && currentQuestion.explanation_hi ? currentQuestion.explanation_hi : currentQuestion.explanation);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-md py-2 px-4 md:px-6 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="truncate">
            <h1 className="text-base md:text-lg font-bold truncate">{exam.name} - Solutions</h1>
            <p className="text-gray-600 text-xs md:text-sm truncate">{exam.fullName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/result/${attemptId}`)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Result
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard"> <Home className="h-4 w-4 mr-1" /> Home </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <main className="flex-grow p-3 md:p-4 overflow-y-auto no-scrollbar">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 max-w-4xl mx-auto">
            {filteredQuestionsIndices.length === 0 ? (
              <div className="text-center py-10">
                <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No questions match the current filter.</p>
                <Button variant="link" onClick={() => setFilter('all')}>Clear filter</Button>
              </div>
            ) : currentQuestion && currentAnswer ? (
            <>
              <div className="flex justify-between items-center mb-3">
                <span className="bg-primary text-white text-xs font-medium py-1 px-2.5 rounded-full">
                  Question {questions.indexOf(currentQuestion) + 1} of {questions.length} 
                  {filter !== 'all' && ` (Filtered: ${actualCurrentQuestionIndex + 1}/${filteredQuestionsIndices.length})`}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Section: {currentQuestion.section}</span>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[90px] h-8 text-xs px-2">
                      <Languages className="h-3 w-3 mr-1"/>
                      <SelectValue placeholder="Lang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 mb-4">
                <h3 className="text-xs font-semibold text-indigo-800 mb-1">Performance Insights (Mock Data):</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1 text-indigo-600"/>Your Time: {Math.floor(Math.random() * 60) + 20}s</div>
                    <div className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1 text-indigo-600"/>Avg. Time: {Math.floor(Math.random() * 40) + 30}s</div>
                    <div className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1 text-indigo-600"/>Topper's Time: {Math.floor(Math.random() * 20) + 15}s</div>
                </div>
              </div>
              
              <div className="mb-5 min-h-[80px]">
                <h2 className="text-sm md:text-base font-medium mb-3">{displayQuestion}</h2>
                <div className="space-y-2.5">
                  {displayOptions.map((option) => {
                    let optionClass = "border-gray-200";
                    let icon = null;
                    if (option.id === currentQuestion.correctAnswer) {
                      optionClass = "border-green-500 bg-green-50";
                      icon = <CheckCircle className="h-4 w-4 text-green-600 ml-auto flex-shrink-0" />;
                    }
                    if (currentAnswer?.selectedOption === option.id) {
                      if (!currentAnswer.isCorrect) {
                        optionClass = "border-red-500 bg-red-50";
                        icon = <XCircle className="h-4 w-4 text-red-600 ml-auto flex-shrink-0" />;
                      } else if (!icon) { // If it was correct and selected, ensure checkmark
                         icon = <CheckCircle className="h-4 w-4 text-green-600 ml-auto flex-shrink-0" />;
                      }
                    }
                    
                    return (
                      <div key={option.id} className={`flex items-center p-2.5 rounded-lg border ${optionClass}`}>
                        <span className="font-medium mr-1.5 text-xs md:text-sm">{option.id.toUpperCase()}.</span>
                        <span className="text-xs md:text-sm flex-grow">{option.text}</span>
                        {icon}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-5">
                <h3 className="text-xs font-semibold text-blue-800 mb-1">Explanation:</h3>
                <p className="text-xs md:text-sm text-blue-700">{displayExplanation}</p>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 mb-5">
                 <div className="flex items-center mb-1">
                    <MessageCircle className="h-4 w-4 text-purple-600 mr-2" />
                    <h3 className="text-xs font-semibold text-purple-800">Ask AI (Placeholder)</h3>
                 </div>
                 <p className="text-xs text-purple-700">Confused about this question? Our AI can help clarify concepts or explain the solution differently.</p>
                 <Button variant="link" className="text-purple-600 px-0 mt-1 text-xs h-auto py-0">Ask AI about this question (Feature coming soon)</Button>
              </div>
              
              <div className="flex flex-wrap justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={goToPrevFilteredQuestion}
                  disabled={actualCurrentQuestionIndex <= 0}
                  className="text-xs h-8 px-2"
                >
                  <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Previous
                </Button>
                <Button 
                  size="sm"
                  onClick={goToNextFilteredQuestion}
                  disabled={actualCurrentQuestionIndex >= filteredQuestionsIndices.length - 1}
                  className="text-xs h-8 px-2"
                >
                  Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </>
            ) : (
              <div className="text-center py-10 text-gray-500"> Preparing solution details... </div>
            )}
          </div>
        </main>
        
        <aside className="bg-white border-t md:border-t-0 md:border-l border-gray-200 p-3 w-full md:w-64 lg:w-72 flex-shrink-0 overflow-y-auto no-scrollbar">
          <div className="mb-3">
            <h3 className="font-medium text-sm mb-1.5">Filter Questions</h3>
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
            <h3 className="font-medium text-sm mb-1.5">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-1">
              {questions.map((question, index) => {
                  const ans = attempt.answers.find(a => a.questionId === question.id);
                  let statusClass = "bg-gray-200 hover:bg-gray-300 text-gray-700"; // Default for not attempted / not visited
                  if (ans?.selectedOption) { // Attempted
                      statusClass = ans.isCorrect ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white";
                  } else if (ans && !ans.selectedOption) { // Explicitly unattempted (skipped)
                     statusClass = "bg-gray-400 hover:bg-gray-500 text-white";
                  }


                  if (!filteredQuestionsIndices.includes(index) && filter !== 'all') {
                    statusClass += " opacity-30 cursor-not-allowed";
                  }

                return (
                  <button
                    key={question.id}
                    className={`p-1.5 rounded text-xs text-center transition-colors ${statusClass} ${currentQuestionIndex === index ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                    onClick={() => {
                      if(filter === 'all' || filteredQuestionsIndices.includes(index)){
                         setCurrentQuestionIndex(index);
                      } else {
                        toast({title: "Question not in filter", description: "Clear filter to view this question.", variant: "default"});
                      }
                    }}
                    disabled={filter !== 'all' && !filteredQuestionsIndices.includes(index)}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SolutionPage;
