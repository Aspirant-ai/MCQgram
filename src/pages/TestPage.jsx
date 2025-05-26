
import React, { useEffect, useRef, useCallback } from 'react';
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
import { useTestTimer } from '@/hooks/useTestTimer';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useQuestionNavigation } from '@/hooks/useQuestionNavigation';
import { useTestState } from '@/hooks/useTestState';

const TestPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const testPageRef = useRef(null);

  const {
    exam, setExam,
    questions, setQuestions,
    answers, setAnswers,
    markedForReview, setMarkedForReview,
    visitedQuestions, setVisitedQuestions,
    currentSection, setCurrentSection,
    language, setLanguage,
    zoomLevel, setZoomLevel,
    isNavPanelOpen, setIsNavPanelOpen,
    isSubmitting, setIsSubmitting,
    isSubmitDialogOpen, setIsSubmitDialogOpen,
    isTimeUpDialogOpen, setIsTimeUpDialogOpen,
  } = useTestState();

  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    goToNextQuestion,
    goToPrevQuestion,
    goToQuestion,
    goToSection,
    markVisited,
  } = useQuestionNavigation(questions, setCurrentSection, setVisitedQuestions);

  const {
    timeLeft,
    setTimeLeft,
    sectionTimers,
    setSectionTimers,
    currentSectionTimeLeft,
    setCurrentSectionTimeLeft,
    formatTime,
    timerRef,
    sectionTimerRef,
  } = useTestTimer(exam?.duration, exam?.sectionDurations, exam?.sections, currentSection, () => {
    if (!isTimeUpDialogOpen && !isSubmitDialogOpen) {
      handleTimeUp();
    }
  });

  const { isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen } = useFullscreen(testPageRef);

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

    enterFullscreen();
    document.body.classList.add('test-page-active');

    return () => {
      document.body.classList.remove('test-page-active');
    };
  }, [examId, toast, navigate, setLanguage, setExam, setCurrentSection, setTimeLeft, setSectionTimers, setQuestions, setAnswers, markVisited, enterFullscreen]);

  useEffect(() => {
    if (exam && questions.length > 0) {
      const newSection = questions[currentQuestionIndex]?.section;
      if (newSection && newSection !== currentSection) {
        setCurrentSection(newSection);
      }
      
      if (exam.sectionDurations && newSection) {
        setCurrentSectionTimeLeft(sectionTimers[newSection]);
      }
    }
    markVisited(currentQuestionIndex);
  }, [currentQuestionIndex, questions, exam, sectionTimers, currentSection, markVisited, setCurrentSection, setCurrentSectionTimeLeft]);

  const handleTimeUp = useCallback(() => {
    if (isTimeUpDialogOpen || isSubmitDialogOpen) return;
    exitFullscreen().finally(() => setIsTimeUpDialogOpen(true));
    if (timerRef.current) clearInterval(timerRef.current);
    if (sectionTimerRef.current) clearInterval(sectionTimerRef.current);
  }, [isTimeUpDialogOpen, isSubmitDialogOpen, exitFullscreen, timerRef, sectionTimerRef, setIsTimeUpDialogOpen]);
  
  useEffect(() => {
    if (timeLeft === 0 && exam && !isTimeUpDialogOpen && !isSubmitDialogOpen) {
      handleTimeUp();
    }
  }, [timeLeft, exam, isTimeUpDialogOpen, isSubmitDialogOpen, handleTimeUp]);
  
  const handleAnswerChange = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const clearResponse = () => {
    if (questions[currentQuestionIndex]) {
      handleAnswerChange(questions[currentQuestionIndex].id, null);
    }
  };
  
  const handleToggleMarkQuestionAndAdvance = () => {
    const qId = questions[currentQuestionIndex]?.id;
    if (!qId) return;

    setMarkedForReview(prev => {
      const isCurrentlyMarked = prev.includes(qId);
      if (isCurrentlyMarked) {
        return prev.filter(id => id !== qId);
      } else {
        return [...prev, qId];
      }
    });

    if (currentQuestionIndex < questions.length - 1) {
      goToNextQuestion();
    } else {
      // Optionally, if it's the last question, you might want to stay or highlight submit
      toast({ title: "Marked", description: "Question marked. This is the last question."});
    }
  };
  
  const getQuestionStatus = useCallback((questionId) => {
    const isAnswered = !!answers[questionId];
    const isMarked = markedForReview.includes(questionId);
    const isVisited = visitedQuestions.includes(questionId);

    if (isAnswered && isMarked) return 'answered-marked';
    if (isAnswered) return 'answered';
    if (isMarked) return 'marked';
    if (isVisited) return 'not-answered';
    return 'not-visited';
  }, [answers, markedForReview, visitedQuestions]);

  const handleSubmitFlow = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const submitLogic = () => {
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
          score: Math.max(0, score),
          totalMarks: exam.totalQuestions * exam.marksPerQuestion,
          timeTaken: exam.duration - Math.floor(timeLeft / 60),
          answers: answeredQuestionDetails,
        };
        
        const savedAttempt = saveAttempt(attemptData);
        setIsSubmitting(false);
        setIsSubmitDialogOpen(false);
        setIsTimeUpDialogOpen(false);
        navigate(`/result/${savedAttempt.id}`);
    };
    
    exitFullscreen().finally(submitLogic);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.7));
  
  if (!exam || questions.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.values(answers).filter(a => a !== null).length;
  const progressPercentage = (questions.length > 0) ? (answeredCount / questions.length) * 100 : 0;
  
  const openSubmitDialog = () => {
    exitFullscreen().finally(() => setIsSubmitDialogOpen(true));
  };

  return (
    <div ref={testPageRef} className="w-full h-screen flex flex-col bg-gray-100 overflow-hidden">
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
        submitTest={openSubmitDialog}
        zoomLevel={zoomLevel}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        language={language}
        setLanguage={setLanguage}
        portalContainer={testPageRef.current}
      />
      
      <main className="flex-grow flex pt-[78px] pb-[50px] overflow-hidden">
        <div className={`flex-grow p-2 md:p-3 flex flex-col items-stretch ${isNavPanelOpen ? 'md:pr-0' : ''}`}>
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
        
        <NavigationPanel
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          goToQuestion={goToQuestion}
          getQuestionStatus={getQuestionStatus}
          isPanelOpen={isNavPanelOpen}
          togglePanel={() => setIsNavPanelOpen(!isNavPanelOpen)}
          submitTest={openSubmitDialog}
        />
      </main>
      
      <TestFooter
        goToPrevQuestion={goToPrevQuestion}
        goToNextQuestion={goToNextQuestion}
        clearResponse={clearResponse}
        toggleMarkQuestion={handleToggleMarkQuestionAndAdvance}
        isMarked={markedForReview.includes(currentQuestion?.id)}
        canGoPrev={currentQuestionIndex > 0}
        canGoNext={currentQuestionIndex < questions.length - 1}
        isNavPanelOpen={isNavPanelOpen}
      />
      
      <SubmitDialog
        isOpen={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
        onSubmit={handleSubmitFlow}
        isSubmitting={isSubmitting}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        portalContainer={testPageRef.current} 
      />
      
      <TimeUpDialog
        isOpen={isTimeUpDialogOpen}
        onOpenChange={setIsTimeUpDialogOpen}
        onSubmit={handleSubmitFlow}
        isSubmitting={isSubmitting}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        portalContainer={testPageRef.current}
      />
    </div>
  );
};

export default TestPage;
