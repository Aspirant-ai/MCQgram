import { useState, useCallback, useEffect } from 'react';

export const useQuestionNavigation = (questions, setCurrentSectionCallback, setVisitedQuestionsCallback) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const markVisited = useCallback((index) => {
    if (questions && questions[index] && setVisitedQuestionsCallback) {
        setVisitedQuestionsCallback(prev => {
            if (!prev.includes(questions[index].id)) {
                return [...prev, questions[index].id];
            }
            return prev;
        });
    }
  }, [questions, setVisitedQuestionsCallback]);

  const updateSection = useCallback((index) => {
    if (questions && questions[index] && setCurrentSectionCallback) {
      const newSection = questions[index].section;
      setCurrentSectionCallback(prevSection => {
        if (newSection && newSection !== prevSection) {
          return newSection;
        }
        return prevSection;
      });
    }
  }, [questions, setCurrentSectionCallback]);

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => {
      if (questions && prev < questions.length - 1) {
        const nextIndex = prev + 1;
        markVisited(nextIndex);
        updateSection(nextIndex);
        return nextIndex;
      }
      return prev;
    });
  }, [questions, markVisited, updateSection]);

  const goToPrevQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => {
      if (prev > 0) {
        const prevIndex = prev - 1;
        markVisited(prevIndex);
        updateSection(prevIndex);
        return prevIndex;
      }
      return prev;
    });
  }, [markVisited, updateSection]);

  const goToQuestion = useCallback((index) => {
    if (questions && index >= 0 && index < questions.length) {
      markVisited(index);
      updateSection(index);
      setCurrentQuestionIndex(index);
    }
  }, [questions, markVisited, updateSection]);

  const goToSection = useCallback((sectionName) => {
    if (questions) {
      const firstQuestionInSection = questions.findIndex(q => q.section === sectionName);
      if (firstQuestionInSection !== -1) {
        goToQuestion(firstQuestionInSection);
      }
    }
  }, [questions, goToQuestion]);
  
  useEffect(() => { 
    if (questions && questions.length > 0) {
        markVisited(currentQuestionIndex);
        updateSection(currentQuestionIndex);
    }
  }, [questions, currentQuestionIndex, markVisited, updateSection]);


  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    goToNextQuestion,
    goToPrevQuestion,
    goToQuestion,
    goToSection,
    markVisited, 
  };
};