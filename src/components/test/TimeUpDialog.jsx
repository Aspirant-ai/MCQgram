
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const TimeUpDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
  answeredCount,
  totalQuestions
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader><DialogTitle>Time's Up!</DialogTitle></DialogHeader>
        <div className="py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start mb-4">
            <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Test time is up. Your answers will be submitted.
            </p>
          </div>
          <p className="text-sm text-gray-600">Answered: {answeredCount}/{totalQuestions}.</p>
        </div>
        <DialogFooter>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Submitting...</> : 'View Results'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimeUpDialog;
