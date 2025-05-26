
import React from 'react';
import { ChevronLeft, ChevronRight, Flag, X, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TestFooter = ({
  goToPrevQuestion,
  goToNextQuestion,
  clearResponse,
  toggleMarkQuestion,
  isMarked,
  canGoPrev,
  canGoNext
}) => {
  return (
    <footer className="bg-white shadow-md py-2 px-4 fixed bottom-0 left-0 right-0 z-20 border-t">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToPrevQuestion}
          disabled={!canGoPrev}
          className="text-xs px-2 py-1 h-8"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={clearResponse}
            className="text-xs px-2 py-1 h-8"
          >
            <RefreshCcw className="mr-1 h-4 w-4" /> Clear
          </Button>
          <Button 
            variant={isMarked ? "secondary" : "outline"}
            size="sm"
            onClick={toggleMarkQuestion}
            className="text-xs px-2 py-1 h-8"
          >
            {isMarked ? 
              <><X className="mr-1 h-4 w-4 text-red-500" /> Unmark</> : 
              <><Flag className="mr-1 h-4 w-4 text-yellow-600" /> Mark</>
            }
          </Button>
        </div>
        <Button 
          size="sm"
          onClick={goToNextQuestion}
          disabled={!canGoNext}
          className="text-xs px-2 py-1 h-8"
        >
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </footer>
  );
};

export default TestFooter;
