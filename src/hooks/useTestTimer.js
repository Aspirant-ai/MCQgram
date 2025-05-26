import { useState, useEffect, useRef, useCallback } from 'react';

export const useTestTimer = (initialDuration, sectionDurationsConfig, sectionsConfig, currentSection, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(initialDuration ? initialDuration * 60 : 0);
  const [sectionTimers, setSectionTimers] = useState({});
  const [currentSectionTimeLeft, setCurrentSectionTimeLeft] = useState(null);
  
  const timerRef = useRef(null);
  const sectionTimerRef = useRef(null);

  useEffect(() => {
    if (initialDuration) {
      setTimeLeft(initialDuration * 60);
    }
  }, [initialDuration]);

  useEffect(() => {
    if (sectionDurationsConfig && sectionsConfig) {
      const initialSectionTimers = {};
      sectionsConfig.forEach(sec => {
        initialSectionTimers[sec] = sectionDurationsConfig[sec] ? sectionDurationsConfig[sec] * 60 : null;
      });
      setSectionTimers(initialSectionTimers);
    }
  }, [sectionDurationsConfig, sectionsConfig]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            if (onTimeUp) onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, onTimeUp]);

  useEffect(() => {
    if (sectionTimerRef.current) clearInterval(sectionTimerRef.current);
    if (currentSection && sectionTimers[currentSection] !== null && sectionTimers[currentSection] > 0) {
      setCurrentSectionTimeLeft(sectionTimers[currentSection]);
      sectionTimerRef.current = setInterval(() => {
        setSectionTimers(prevTimers => {
          const newTimers = { ...prevTimers };
          if (newTimers[currentSection] > 0) {
            newTimers[currentSection] -= 1;
            setCurrentSectionTimeLeft(newTimers[currentSection]);
          }
          if (newTimers[currentSection] <= 0) {
            clearInterval(sectionTimerRef.current);
            // Potentially handle section time up logic here
          }
          return newTimers;
        });
      }, 1000);
    }
    return () => clearInterval(sectionTimerRef.current);
  }, [currentSection, sectionTimers]);

  const formatTime = useCallback((seconds) => {
    if (seconds === null || seconds === undefined) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeLeft,
    setTimeLeft,
    sectionTimers,
    setSectionTimers,
    currentSectionTimeLeft,
    setCurrentSectionTimeLeft,
    formatTime,
    timerRef,
    sectionTimerRef,
  };
};