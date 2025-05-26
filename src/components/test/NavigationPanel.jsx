
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelRightOpen, PanelRightClose, Flag, Check, X as LucideX } from 'lucide-react';

const NavigationPanel = ({
  questions,
  currentQuestionIndex,
  goToQuestion,
  getQuestionStatus, // Pass this function
  isPanelOpen,
  togglePanel,
  submitTest // Pass submitTest function
}) => {
  if (!isPanelOpen) {
    return (
      <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-30 md:hidden">
        <Button variant="outline" size="icon" onClick={togglePanel} className="rounded-l-md rounded-r-none shadow-lg">
          <PanelRightOpen className="h-5 w-5" />
        </Button>
      </div>
    );
  }
  
  const answeredCount = questions.filter(q => getQuestionStatus(q.id) === 'answered' || getQuestionStatus(q.id) === 'answered-marked').length;
  const markedCount = questions.filter(q => getQuestionStatus(q.id) === 'marked' || getQuestionStatus(q.id) === 'answered-marked').length;
  const notAnsweredCount = questions.length - answeredCount;


  const getStatusStyles = (status) => {
    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white hover:bg-green-600'; // Green for answered
      case 'not-answered':
        return 'bg-red-500 text-white hover:bg-red-600'; // Red for not answered (if skipped)
      case 'marked': // Blue if marked but not answered
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'answered-marked': // Purple if answered and marked
        return 'bg-purple-500 text-white hover:bg-purple-600';
      default: // Default for not-visited or current (if not answered)
        return 'bg-gray-200 hover:bg-gray-300 text-gray-700';
    }
  };
  
  return (
    <aside className={`bg-white border-l border-gray-200 p-3 flex flex-col transition-all duration-300 ease-in-out fixed inset-y-0 right-0 z-30 md:relative md:inset-auto md:translate-x-0 transform ${isPanelOpen ? 'translate-x-0 w-64 sm:w-72' : 'translate-x-full w-0 md:w-72' } overflow-y-auto no-scrollbar`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-sm">Question Navigator</h3>
        <Button variant="ghost" size="icon" onClick={togglePanel} className="md:hidden">
           <PanelRightClose className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid grid-cols-5 gap-1.5 mb-3">
        {questions.map((question, index) => {
          const status = getQuestionStatus(question.id);
          let statusClass = getStatusStyles(status);
          
          return (
            <button
              key={question.id}
              className={`p-1.5 rounded text-xs text-center transition-colors relative ${statusClass} ${currentQuestionIndex === index ? 'ring-2 ring-primary ring-offset-1' : ''}`}
              onClick={() => goToQuestion(index)}
              title={`Q ${index + 1}: ${status.replace('-', ' ')}`}
            >
              {index + 1}
              {status === 'answered-marked' && <Check className="h-2.5 w-2.5 absolute top-0.5 right-0.5 text-white"/>}
              {(status === 'marked') && <Flag className="h-2.5 w-2.5 absolute top-0.5 right-0.5 text-white"/>}
            </button>
          );
        })}
      </div>
      
      <div className="mt-2 text-xs space-y-1">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-sm mr-1.5"></div>
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-sm mr-1.5"></div>
          <span>Not Answered ({notAnsweredCount})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1.5"></div>
          <span>Marked & Not Answered ({questions.filter(q => getQuestionStatus(q.id) === 'marked').length})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-sm mr-1.5"></div>
          <span>Answered & Marked ({questions.filter(q => getQuestionStatus(q.id) === 'answered-marked').length})</span>
        </div>
         <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-200 rounded-sm mr-1.5 border border-gray-400"></div>
          <span>Not Visited ({questions.filter(q => getQuestionStatus(q.id) === 'not-visited').length})</span>
        </div>
      </div>
      
      <div className="mt-auto pt-4">
        <Button 
          className="w-full"
          size="sm"
          onClick={submitTest}
        >
          Submit Test
        </Button>
      </div>
    </aside>
  );
};

export default NavigationPanel;
