import { useState } from 'react';

export const useTestState = () => {
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  
  const [currentSection, setCurrentSection] = useState('');
  const [language, setLanguage] = useState('en');
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const [isNavPanelOpen, setIsNavPanelOpen] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isTimeUpDialogOpen, setIsTimeUpDialogOpen] = useState(false);

  return {
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
  };
};