
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, FileText, AlertTriangle, CheckCircle2, Languages, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getExamById } from '@/lib/data/examData';
import { useToast } from '@/components/ui/use-toast';

const TestInstructionsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const pageRef = React.useRef(null);
  
  const exam = getExamById(examId);
  
  useEffect(() => {
    if (!exam) {
      toast({
        title: "Exam not found",
        description: "The exam you're looking for doesn't exist.",
        variant: "destructive"
      });
      navigate('/categories');
    } else {
       if (pageRef.current && document.fullscreenEnabled) {
        pageRef.current.requestFullscreen().catch(err => {
          console.warn(`Error attempting to enable full-screen mode on instructions page: ${err.message} (${err.name})`);
        });
      }
    }
    return () => {
      if (document.fullscreenElement && pageRef.current && pageRef.current.contains(document.fullscreenElement)) {
        document.exitFullscreen();
      }
    };
  }, [exam, toast, navigate]);

  if (!exam) {
    return null; 
  }

  const startTest = () => {
    localStorage.setItem('preferredLang', selectedLanguage);
    if (document.fullscreenElement && pageRef.current && pageRef.current.contains(document.fullscreenElement)) {
      document.exitFullscreen().then(() => navigate(`/test/${examId}`)).catch(() => navigate(`/test/${examId}`));
    } else {
      navigate(`/test/${examId}`);
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

  return (
    <div ref={pageRef} className="min-h-screen w-full flex flex-col items-center justify-center py-6 px-4 bg-gray-100">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/exams/${exam.categoryId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Exams
            </Button>
            <Button variant="outline" size="icon" onClick={toggleFullscreen} title="Toggle Fullscreen">
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-primary text-white p-3 rounded-lg mr-4">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">{exam.name} - Test Instructions</h1>
                <p className="text-gray-600 text-sm md:text-base">{exam.fullName}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-3">Exam Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-gray-600">{exam.duration} minutes</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="font-medium">Total Questions</p>
                    <p className="text-gray-600">{exam.totalQuestions} questions</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="font-medium">Marks Per Question</p>
                    <p className="text-gray-600">{exam.marksPerQuestion} marks</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="font-medium">Negative Marking</p>
                    <p className="text-gray-600">-{exam.negativeMarking} marks for wrong answers</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-1 text-sm md:text-base">Sections</h3>
                <div className="flex flex-wrap gap-2">
                  {exam.sections.map((section, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-700 py-1 px-2 rounded-full text-xs md:text-sm"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-2">Select Language</h2>
              <div className="flex items-center space-x-2">
                <Languages className="h-5 w-5 text-gray-500" />
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[180px] h-9 text-sm">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-semibold mb-3">Instructions</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-60 overflow-y-auto text-sm md:text-base">
                <ul className="space-y-2.5">
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2.5 mt-0.5 shrink-0">1</span>
                    <p>The test consists of {exam.totalQuestions} multiple-choice questions to be completed in {exam.duration} minutes.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2.5 mt-0.5 shrink-0">2</span>
                    <p>Each question carries {exam.marksPerQuestion} marks. There is a negative marking of {exam.negativeMarking} marks for each wrong answer.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2.5 mt-0.5 shrink-0">3</span>
                    <p>You can navigate between questions and review your answers before submitting the test.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2.5 mt-0.5 shrink-0">4</span>
                    <p>You can mark questions for review and come back to them later if you're unsure about the answer.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2.5 mt-0.5 shrink-0">5</span>
                    <p>The test will automatically submit when the time is up. Make sure to submit your answers before the time runs out.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2.5 mt-0.5 shrink-0">6</span>
                    <p>Once you submit the test, you will be able to see your results and review your answers.</p>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                size="lg"
                onClick={startTest}
                className="w-full md:w-auto text-base"
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
