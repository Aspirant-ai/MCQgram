import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, FileText, AlertTriangle, CheckCircle2, Languages, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectPortal } from "@/components/ui/select";
import { getExamById } from '@/lib/data/examData';
import { useToast } from '@/components/ui/use-toast';

const TestInstructionsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const pageRef = React.useRef(null);
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  
  const exam = getExamById(examId);
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreenActive(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    if (!exam) {
      toast({
        title: "Exam not found",
        description: "The exam you're looking for doesn't exist or the ID is incorrect.",
        variant: "destructive"
      });
      navigate('/dashboard/categories'); // Corrected navigation path
      return; // Ensure no further execution if exam is not found
    } else {
       if (pageRef.current && document.fullscreenEnabled && !document.fullscreenElement) {
        pageRef.current.requestFullscreen().catch(err => {
          console.warn(`Error attempting to enable full-screen mode on instructions page: ${err.message} (${err.name})`);
        });
      }
    }
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (document.fullscreenElement && pageRef.current && pageRef.current.contains(document.fullscreenElement)) {
        document.exitFullscreen().catch(err => console.warn("Error exiting fullscreen on unmount:", err));
      }
    };
  }, [exam, examId, toast, navigate]); // Added examId to dependency array

  if (!exam) {
    // This return ensures a blank page isn't shown while navigating
    // or if the navigate call in useEffect hasn't completed yet.
    return null; 
  }

  const startTest = () => {
    localStorage.setItem('preferredLang', selectedLanguage);
    if (document.fullscreenElement && pageRef.current && pageRef.current.contains(document.fullscreenElement)) {
      document.exitFullscreen().then(() => navigate(`/test/${examId}`)).catch(() => navigate(`/dashboard/test/${examId}`));
    } else {
      navigate(`/dashboard/test/${examId}`);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      pageRef.current?.requestFullscreen().catch(err => {
         console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const backToExamsPath = exam.categoryId ? `/dashboard/exams/${exam.categoryId}` : '/dashboard/categories';

  return (
    <div ref={pageRef} className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full h-full bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
        <div className="p-4 md:p-6 flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(backToExamsPath)}
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Exams
            </Button>
            <Button variant="outline" size="icon" onClick={toggleFullscreen} title="Toggle Fullscreen" className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700">
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-grow flex flex-col"
          >
            <div className="flex items-center mb-4">
              <div className="bg-primary text-white p-2 md:p-3 rounded-lg mr-3 md:mr-4">
                <FileText className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{exam.name} - Test Instructions</h1>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-base">{exam.fullName}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h2 className="text-md md:text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Exam Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-base">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Duration</p>
                    <p className="text-gray-600 dark:text-gray-400">{exam.duration} minutes</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 md:h-5 md:w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Total Questions</p>
                    <p className="text-gray-600 dark:text-gray-400">{exam.totalQuestions} questions</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Marks Per Question</p>
                    <p className="text-gray-600 dark:text-gray-400">{exam.marksPerQuestion} marks</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-gray-500 dark:text-gray-400 mr-2" />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Negative Marking</p>
                    <p className="text-gray-600 dark:text-gray-400">-{exam.negativeMarking} marks for wrong answers</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <h3 className="font-medium mb-1 text-xs md:text-base text-gray-700 dark:text-gray-300">Sections</h3>
                <div className="flex flex-wrap gap-1.5">
                  {exam.sections.map((section, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-0.5 px-1.5 rounded-full text-xs"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-md md:text-xl font-semibold mb-1 text-gray-800 dark:text-gray-200">Select Language</h2>
              <div className="flex items-center space-x-2">
                <Languages className="h-4 w-4 md:h-5 md:w-5 text-gray-500 dark:text-gray-400" />
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[150px] md:w-[180px] h-8 md:h-9 text-xs md:text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectPortal container={isFullscreenActive ? pageRef.current : undefined}>
                    <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </div>
            </div>
            
            <div className="mb-4 flex-grow flex flex-col">
              <h2 className="text-md md:text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Instructions</h2>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600 flex-grow overflow-y-auto text-xs md:text-base custom-scrollbar">
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs mr-2 mt-0.5 shrink-0">1</span>
                    <p>The test consists of {exam.totalQuestions} multiple-choice questions to be completed in {exam.duration} minutes.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs mr-2 mt-0.5 shrink-0">2</span>
                    <p>Each question carries {exam.marksPerQuestion} marks. There is a negative marking of {exam.negativeMarking} marks for each wrong answer.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs mr-2 mt-0.5 shrink-0">3</span>
                    <p>You can navigate between questions and review your answers before submitting the test.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs mr-2 mt-0.5 shrink-0">4</span>
                    <p>You can mark questions for review and come back to them later if you're unsure about the answer.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs mr-2 mt-0.5 shrink-0">5</span>
                    <p>The test will automatically submit when the time is up. Make sure to submit your answers before the time runs out.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-xs mr-2 mt-0.5 shrink-0">6</span>
                    <p>Once you submit the test, you will be able to see your results and review your answers.</p>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-auto flex justify-center">
              <Button 
                size="lg"
                onClick={startTest}
                className="w-full md:w-auto text-sm md:text-base"
              >
                Start Test
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TestInstructionsPage;
