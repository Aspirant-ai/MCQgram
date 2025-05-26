
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const SubmitDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
  answeredCount,
  totalQuestions
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Submit Test</DialogTitle></DialogHeader>
        <div className="py-4">
          <p className="mb-4">Are you sure you want to submit your test?</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-800">
                Answered: {answeredCount}/{totalQuestions}. Unanswered: {totalQuestions - answeredCount}.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Continue Test</Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Submitting...</> : 'Submit Test'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitDialog;
