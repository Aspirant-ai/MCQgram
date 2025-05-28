
import React, { useEffect, useRef, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

const QuestionPanel = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  answers,
  handleAnswerChange,
  progressPercentage,
  language,
  zoomLevel
}) => {
  const [questionTime, setQuestionTime] = useState(0);
  const questionTimerRef = useRef(null);

  useEffect(() => {
    setQuestionTime(0); 
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    questionTimerRef.current = setInterval(() => {
      setQuestionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(questionTimerRef.current);
  }, [currentQuestionIndex]);

  const formatQuestionTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!currentQuestion) return null;

  const displayQuestionText = language === 'hi' && currentQuestion.question_hi ? currentQuestion.question_hi : currentQuestion.question;
  const displayOptions = currentQuestion.options.map(opt => ({
    ...opt,
    text: language === 'hi' && opt.text_hi ? opt.text_hi : opt.text
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-5 flex-grow flex flex-col overflow-hidden" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
      <div className="flex justify-between items-center mb-2">
        <span className="bg-primary text-white text-xs font-medium py-1 px-2.5 rounded-full">
          Question {currentQuestionIndex + 1}/{totalQuestions}
        </span>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>Time on this question: {formatQuestionTime(questionTime)}</span>
        </div>
      </div>
      
      <Progress value={progressPercentage} className="h-1.5 mb-3" />
      
      <div className="text-sm md:text-base font-medium mb-3 leading-relaxed question-text-container overflow-y-auto pr-2 custom-scrollbar flex-shrink-0">
        {displayQuestionText}
      </div>
      
      <RadioGroup 
        value={answers[currentQuestion.id] || ""} 
        onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
        className="space-y-2 options-container overflow-y-auto pr-2 custom-scrollbar flex-shrink-0"
      >
        {displayOptions.map((option) => (
          <div key={option.id} className="flex items-start space-x-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-primary cursor-pointer">
            <RadioGroupItem 
              value={option.id} 
              id={`option-${option.id}-${currentQuestion.id}`} 
              className="mt-1 flex-shrink-0"
            />
            <Label 
              htmlFor={`option-${option.id}-${currentQuestion.id}`}
              className="flex-grow cursor-pointer text-xs md:text-sm"
            >
              <span className="font-medium mr-1.5">{option.id.toUpperCase()}.</span>
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {/* Empty div to push content up if options don't fill space, QuestionPanel is flex-grow */}
      <div className="flex-grow"></div> 
    </div>
  );
};

export default QuestionPanel;
