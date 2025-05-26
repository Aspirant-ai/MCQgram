import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogPortal,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Loader2, Clock } from 'lucide-react';

const TimeUpDialog = ({ isOpen, onOpenChange, onSubmit, isSubmitting, answeredCount, totalQuestions, portalContainer }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogPortal container={portalContainer}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
                <Clock className="h-10 w-10 text-destructive mr-3" />
                <AlertDialogTitle className="text-2xl">Time's Up!</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-center">
              Your allotted time for this test has expired.
              <br />
              You answered {answeredCount} out of {totalQuestions} questions.
              <br />
              Your test will now be submitted automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction onClick={onSubmit} disabled={isSubmitting} className="w-full" asChild>
               <Button className="bg-primary hover:bg-primary/90 w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                View Results
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

export default TimeUpDialog;