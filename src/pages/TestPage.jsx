import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle, 
  X,
  AlertCircle,
  Maximize,
  Minimize,
  RefreshCcw,
  Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getExamById, getQuestionsForExam } from '@/lib/data/examData';
import { saveAttempt } from '@/lib/data/userAttempts';
import { useToast } from '@/components/ui/use-toast';

const TestPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isTimeUpDialogOpen, setIsTimeUpDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [language, setLanguage] = useState('en');
  
  const timerRef = useRef(null);
  const testPageRef = useRef(null);

  useEffect(() => {
    const preferredLang = localStorage.getItem('preferredLang') || 'en';
    setLanguage(preferredLang);

    const examData = getExamById(examId);
    if (!examData) {
      toast({
        title: "Exam not found",
        description: "The exam you're looking for doesn't exist.",
        variant: "destructive"
      });
      navigate('/categories');
      return;
    }
    
    setExam(examData);
    setCurrentSection(examData.sections[0]);
    setTimeLeft(examData.duration * 60);
    
    const questionsData = getQuestionsForExam(examId);
    setQuestions(questionsData);
    
    const initialAnswers = {};
    questionsData.forEach(q => {
      initialAnswers[q.id] = null;
    });
    setAnswers(initialAnswers);
    
    if (testPageRef.current && document.fullscreenEnabled) {
      testPageRef.current.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [examId, toast, navigate]);

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentSection(questions[currentQuestionIndex].section);
    }
  }, [currentQuestionIndex, questions]);
  
  const handleTimeUp = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsTimeUpDialogOpen(true);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      testPageRef.current.requestFullscreen().catch(err => {
         console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAnswerChange = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const clearResponse = () => {
    if (questions[currentQuestionIndex]) {
      handleAnswerChange(questions[currentQuestionIndex].id, null);
    }
  };
  
  const toggleMarkQuestion = (questionId) => {
    setMarkedQuestions(prev => 
      prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
    );
  };
  
  const goToSection = (sectionName) => {
    const firstQuestionInSection = questions.findIndex(q => q.section === sectionName);
    if (firstQuestionInSection !== -1) {
      setCurrentQuestionIndex(firstQuestionInSection);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };
  
  const getQuestionStatus = (questionId) => {
    if (markedQuestions.includes(questionId)) return 'marked';
    if (answers[questionId]) return 'answered';
    return 'not-answered';
  };
  
  const handleSubmitTest = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    
    try {
      let score = 0;
      const answeredQuestions = questions.map(question => {
        const selectedOption = answers[question.id];
        const isCorrect = selectedOption === question.correctAnswer;
        if (selectedOption) {
          if (isCorrect) score += exam.marksPerQuestion;
          else score -= exam.negativeMarking;
        }
        return { questionId: question.id, selectedOption, isCorrect };
      });
      
      const attempt = {
        examId: exam.id,
        score: Math.max(0, score),
        totalMarks: exam.totalQuestions * exam.marksPerQuestion,
        timeTaken: exam.duration - Math.floor(timeLeft / 60),
        answers: answeredQuestions
      };
      
      const savedAttempt = saveAttempt(attempt);
      navigate(`/result/${savedAttempt.id}`);
    } catch (error) {
      toast({
        title: "Error submitting test",
        description: "There was an error. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const progressPercentage = (answeredCount / questions.length) * 100;
  const isTimeWarning = timeLeft <= 300;
  
  const displayQuestion = language === 'hi' && currentQuestion.question_hi ? currentQuestion.question_hi : currentQuestion.question;
  const displayOptions = currentQuestion.options.map(opt => ({
    ...opt,
    text: language === 'hi' && opt.text_hi ? opt.text_hi : opt.text
  }));

  return (
    <div ref={testPageRef} className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-md py-3 px-4 md:px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg md:text-xl font-bold">{exam.name}</h1>
            <p className="text-gray-600 text-xs md:text-sm">{exam.fullName}</p>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="outline" size="sm" onClick={toggleFullscreen} className="hidden md:inline-flex">
              {isFullscreen ? <Minimize className="h-4 w-4 mr-1" /> : <Maximize className="h-4 w-4 mr-1" />}
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
            <div className={`flex items-center ${isTimeWarning ? 'text-red-500 timer-warning' : 'text-gray-700'}`}>
              <Clock className="h-4 md:h-5 w-4 md:w-5 mr-1 md:mr-2" />
              <span className="font-mono text-base md:text-lg font-semibold">{formatTime(timeLeft)}</span>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setIsSubmitDialogOpen(true)}
            >
              Submit
            </Button>
          </div>
        </div>
        <div className="container mx-auto mt-2">
          <div className="flex space-x-1 overflow-x-auto pb-1">
            {exam.sections.map(sec => (
              <Button
                key={sec}
                variant={currentSection === sec ? "default" : "outline"}
                size="sm"
                className="text-xs whitespace-nowrap"
                onClick={() => goToSection(sec)}
              >
                {sec}
              </Button>
            ))}
          </div>
        </div>
      </header>
      
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <div className="flex-grow p-4 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 max-w-4xl mx-auto">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <span className="bg-primary text-white text-xs md:text-sm font-medium py-1 px-2 md:px-3 rounded-full">
                    Question {currentQuestionIndex + 1}/{questions.length}
                  </span>
                  {markedQuestions.includes(currentQuestion.id) && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs py-1 px-2 rounded-full flex items-center">
                      <Flag className="h-3 w-3 mr-1" /> Marked
                    </span>
                  )}
                </div>
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
              
              <Progress value={progressPercentage} className="h-1.5 md:h-2 mb-4" />
              
              <div className="mb-6 min-h-[100px]">
                <h2 className="text-base md:text-lg font-medium mb-4">{displayQuestion}</h2>
                <RadioGroup 
                  value={answers[currentQuestion.id] || ""} 
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  className="space-y-3"
                >
                  {displayOptions.map((option) => (
                    <div key={option.id} className="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-primary">
                      <RadioGroupItem 
                        value={option.id} 
                        id={`option-${option.id}`} 
                        className="mt-1"
                      />
                      <Label 
                        htmlFor={`option-${option.id}`}
                        className="flex-grow cursor-pointer text-sm md:text-base"
                      >
                        <span className="font-medium mr-2">{option.id.toUpperCase()}.</span>
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex flex-wrap justify-between gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={goToPrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={clearResponse}
                  >
                    <RefreshCcw className="mr-1 h-4 w-4" /> Clear
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleMarkQuestion(currentQuestion.id)}
                  >
                    {markedQuestions.includes(currentQuestion.id) ? 
                      <><X className="mr-1 h-4 w-4" /> Unmark</> : 
                      <><Flag className="mr-1 h-4 w-4" /> Mark</>
                    }
                  </Button>
                </div>
                <Button 
                  size="sm"
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border-t md:border-t-0 md:border-l border-gray-200 p-3 md:w-72 lg:w-80 flex-shrink-0 overflow-y-auto">
          <div className="mb-3">
            <h3 className="font-medium text-sm mb-2">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-1.5">
              {questions.map((question, index) => (
                <button
                  key={question.id}
                  className={`question-number text-xs ${getQuestionStatus(question.id)} ${currentQuestionIndex === index ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                  onClick={() => goToQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 text-xs">
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 bg-primary rounded-full mr-1.5"></div>
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1.5"></div>
              <span>Marked ({markedQuestions.length})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded-full mr-1.5"></div>
              <span>Not Answered ({questions.length - answeredCount})</span>
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              className="w-full"
              size="sm"
              onClick={() => setIsSubmitDialogOpen(true)}
            >
              Submit Test
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Submit Test</DialogTitle></DialogHeader>
          <div className="py-4">
            <p className="mb-4">Are you sure you want to submit your test?</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800">
                  Answered: {answeredCount}/{questions.length}. Unanswered: {questions.length - answeredCount}.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>Continue Test</Button>
            <Button onClick={handleSubmitTest} disabled={isSubmitting}>
              {isSubmitting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Submitting...</> : 'Submit Test'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isTimeUpDialogOpen} onOpenChange={setIsTimeUpDialogOpen}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <DialogHeader><DialogTitle>Time's Up!</DialogTitle></DialogHeader>
          <div className="py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start mb-4">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              <p className="text-sm text-blue-800">
                Test time is up. Your answers will be submitted.
              </p>
            </div>
            <p className="text-sm text-gray-600">Answered: {answeredCount}/{questions.length}.</p>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitTest} disabled={isSubmitting}>
              {isSubmitting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Submitting...</> : 'View Results'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestPage;