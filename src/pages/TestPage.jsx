
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TestHeader from '@/components/test/TestHeader';
import QuestionPanel from '@/components/test/QuestionPanel';
import TestFooter from '@/components/test/TestFooter';
import NavigationPanel from '@/components/test/NavigationPanel';
import SubmitDialog from '@/components/test/SubmitDialog';
import TimeUpDialog from '@/components/test/TimeUpDialog';
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
  const [markedForReview, setMarkedForReview] = useState([]); // question IDs marked for review
  const [visitedQuestions, setVisitedQuestions] = useState([]); // question IDs that have been visited
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [sectionTimers, setSectionTimers] = useState({}); // For section-wise timing
  const [currentSectionTimeLeft, setCurrentSectionTimeLeft] = useState(null);

  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isTimeUpDialogOpen, setIsTimeUpDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNavPanelOpen, setIsNavPanelOpen] = useState(true); 
  const [currentSection, setCurrentSection] = useState('');
  const [language, setLanguage] = useState('en');
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const timerRef = useRef(null);
  const sectionTimerRef = useRef(null);
  const testPageRef = useRef(null);

  const markVisited = (index) => {
    if (!visitedQuestions.includes(questions[index]?.id)) {
      setVisitedQuestions(prev => [...prev, questions[index]?.id]);
    }
  };
  
  useEffect(() => {
    const preferredLang = localStorage.getItem('preferredLang') || 'en';
    setLanguage(preferredLang);

    const examData = getExamById(examId);
    if (!examData) {
      toast({ title: "Exam not found", variant: "destructive" });
      navigate('/categories');
      return;
    }
    
    setExam(examData);
    setCurrentSection(examData.sections[0]);
    setTimeLeft(examData.duration * 60);
    
    // Initialize section timers if section-wise timing exists
    if (examData.sectionDurations) {
      const initialSectionTimers = {};
      examData.sections.forEach(sec => {
        initialSectionTimers[sec] = examData.sectionDurations[sec] * 60;
      });
      setSectionTimers(initialSectionTimers);
    }
    
    const questionsData = getQuestionsForExam(examId);
    setQuestions(questionsData);
    setAnswers(Object.fromEntries(questionsData.map(q => [q.id, null])));
    
    if (questionsData.length > 0) markVisited(0);


    if (testPageRef.current && document.fullscreenEnabled) {
      testPageRef.current.requestFullscreen().catch(err => {
        console.warn(`Error attempting full-screen: ${err.message}`);
      });
    }

    // Main timer
    timerRef.current = setInterval(() => setTimeLeft(prev => prev <= 1 ? 0 : prev - 1), 1000);
    
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Disable scroll
    document.body.style.overflow = 'hidden';

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (sectionTimerRef.current) clearInterval(sectionTimerRef.current);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (document.fullscreenElement) document.exitFullscreen();
      document.body.style.overflow = 'auto'; // Re-enable scroll
    };
  }, [examId, toast, navigate]);

  // Effect for section change and section timer
  useEffect(() => {
    if (exam && questions.length > 0) {
      const newSection = questions[currentQuestionIndex]?.section;
      if (newSection && newSection !== currentSection) {
        setCurrentSection(newSection);
      }
      
      if (exam.sectionDurations && newSection) {
        setCurrentSectionTimeLeft(sectionTimers[newSection]);
        if (sectionTimerRef.current) clearInterval(sectionTimerRef.current);
        sectionTimerRef.current = setInterval(() => {
          setSectionTimers(prev => {
            const updatedTimes = { ...prev };
            if (updatedTimes[newSection] > 0) {
              updatedTimes[newSection] -= 1;
              setCurrentSectionTimeLeft(updatedTimes[newSection]);
            } else {
              // Handle section time up - auto-navigate or show warning
              // For now, just stops the timer for that section
              clearInterval(sectionTimerRef.current);
            }
            return updatedTimes;
          });
        }, 1000);
      }
    }
    markVisited(currentQuestionIndex);
  }, [currentQuestionIndex, questions, exam, sectionTimers, currentSection]);

  useEffect(() => {
    if (timeLeft === 0 && exam) handleTimeUp();
  }, [timeLeft, exam]);

  const handleTimeUp = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    setIsTimeUpDialogOpen(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (sectionTimerRef.current) clearInterval(sectionTimerRef.current);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      testPageRef.current?.requestFullscreen().catch(err => console.warn(`Fullscreen error: ${err.message}`));
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
  
  const toggleMarkQuestion = () => {
    const qId = questions[currentQuestionIndex]?.id;
    if (!qId) return;
    setMarkedForReview(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
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
      setCurrentQuestionIndex(prev => prev + 1 - 2); // Hack to trigger useEffect correctly
    }
  };
  
  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };
  
  const getQuestionStatus = useCallback((questionId) => {
    const isAnswered = !!answers[questionId];
    const isMarked = markedForReview.includes(questionId);
    const isVisited = visitedQuestions.includes(questionId);

    if (isAnswered && isMarked) return 'answered-marked'; // Purple
    if (isAnswered) return 'answered'; // Green
    if (isMarked) return 'marked'; // Blue
    if (isVisited) return 'not-answered'; // Red (visited but not answered)
    return 'not-visited'; // Gray
  }, [answers, markedForReview, visitedQuestions]);

  const handleSubmitFlow = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (document.fullscreenElement) document.exitFullscreen();
    
    try {
      let score = 0;
      const answeredQuestionDetails = questions.map(question => {
        const selectedOption = answers[question.id];
        const isCorrect = selectedOption === question.correctAnswer;
        if (selectedOption) {
          score += isCorrect ? exam.marksPerQuestion : -exam.negativeMarking;
        }
        return { questionId: question.id, selectedOption, isCorrect };
      });
      
      const attemptData = {
        examId: exam.id,
        score: Math.max(0, score), // Ensure score doesn't go negative
        totalMarks: exam.totalQuestions * exam.marksPerQuestion,
        timeTaken: exam.duration - Math.floor(timeLeft / 60), // Overall time
        answers: answeredQuestionDetails,
        // sectionTimings: sectionTimers // You might want to store this
      };
      
      const savedAttempt = saveAttempt(attemptData);
      navigate(`/result/${savedAttempt.id}`);
    } catch (error) {
      toast({ title: "Error submitting test", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  
  if (!exam || questions.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const progressPercentage = (answeredCount / questions.length) * 100;
  
  return (
    <div ref={testPageRef} className="w-full h-full flex flex-col bg-gray-100 overflow-hidden">
      <TestHeader
        examName={exam.name}
        examFullName={exam.fullName}
        timeLeft={timeLeft}
        formatTime={formatTime}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        isPanelOpen={isNavPanelOpen}
        togglePanel={() => setIsNavPanelOpen(!isNavPanelOpen)}
        currentSection={currentSection}
        sections={exam.sections}
        goToSection={goToSection}
        submitTest={() => setIsSubmitDialogOpen(true)}
        zoomLevel={zoomLevel}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        language={language}
        setLanguage={setLanguage}
      />
      
      <main className="flex-grow flex pt-[78px] pb-[50px] overflow-hidden"> {/* Adjusted padding for header/footer */}
        <div className="flex-grow p-3 overflow-y-auto no-scrollbar flex justify-center items-start"> {/* Question Panel Wrapper */}
          <div className="w-full max-w-4xl"> {/* Max width for question content */}
            {currentQuestion && (
              <QuestionPanel
                currentQuestion={currentQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                answers={answers}
                handleAnswerChange={handleAnswerChange}
                progressPercentage={progressPercentage}
                language={language}
                zoomLevel={zoomLevel}
              />
            )}
          </div>
        </div>
        
        <NavigationPanel
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          goToQuestion={goToQuestion}
          getQuestionStatus={getQuestionStatus}
          isPanelOpen={isNavPanelOpen}
          togglePanel={() => setIsNavPanelOpen(!isNavPanelOpen)}
          submitTest={() => setIsSubmitDialogOpen(true)}
        />
      </main>
      
      <TestFooter
        goToPrevQuestion={goToPrevQuestion}
        goToNextQuestion={goToNextQuestion}
        clearResponse={clearResponse}
        toggleMarkQuestion={toggleMarkQuestion}
        isMarked={markedForReview.includes(currentQuestion?.id)}
        canGoPrev={currentQuestionIndex > 0}
        canGoNext={currentQuestionIndex < questions.length - 1}
      />
      
      <SubmitDialog
        isOpen={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
        onSubmit={handleSubmitFlow}
        isSubmitting={isSubmitting}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
      />
      
      <TimeUpDialog
        isOpen={isTimeUpDialogOpen}
        onOpenChange={setIsTimeUpDialogOpen} // Typically, this dialog shouldn't be closable by user
        onSubmit={handleSubmitFlow}
        isSubmitting={isSubmitting}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
      />
    </div>
  );
};

export default TestPage;
