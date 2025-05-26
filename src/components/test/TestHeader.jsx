
import React from 'react';
import { Clock, Maximize, Minimize, Plus, Minus, PanelRightOpen, PanelRightClose, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TestHeader = ({
  examName,
  examFullName,
  timeLeft,
  formatTime,
  isFullscreen,
  toggleFullscreen,
  isPanelOpen,
  togglePanel,
  currentSection,
  sections,
  goToSection,
  submitTest,
  zoomLevel,
  handleZoomIn,
  handleZoomOut,
  language,
  setLanguage
}) => {
  const isTimeWarning = timeLeft <= 300;

  return (
    <header className="bg-white shadow-md py-2 px-4 fixed top-0 left-0 right-0 z-20">
      <div className="flex justify-between items-center">
        <div className="max-w-[calc(100%-350px)]">
          <h1 className="text-base md:text-lg font-bold truncate" title={examName}>{examName}</h1>
          <p className="text-gray-600 text-xs md:text-sm truncate" title={examFullName}>{examFullName}</p>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Zoom Out">
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-xs w-8 text-center">{Math.round(zoomLevel * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Zoom In">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
           <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[90px] h-8 text-xs px-2 py-1">
              <Languages className="h-3 w-3 mr-1"/>
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
            </SelectContent>
          </Select>
          <div className={`flex items-center p-1 rounded ${isTimeWarning ? 'text-red-500 bg-red-50 timer-warning' : 'text-gray-700 bg-gray-100'}`}>
            <Clock className="h-4 w-4 mr-1" />
            <span className="font-mono text-sm font-semibold">{formatTime(timeLeft)}</span>
          </div>
          <Button 
            variant="destructive" 
            size="sm"
            className="text-xs px-2 py-1 h-8"
            onClick={submitTest}
          >
            Submit
          </Button>
          <Button variant="outline" size="icon" onClick={togglePanel} className="md:hidden" title={isPanelOpen ? 'Hide Panel' : 'Show Panel'}>
            {isPanelOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <div className="mt-1 flex space-x-1 overflow-x-auto pb-1 no-scrollbar">
        {sections.map(sec => (
          <Button
            key={sec}
            variant={currentSection === sec ? "default" : "outline"}
            size="sm"
            className="text-xs whitespace-nowrap px-2 py-1 h-7"
            onClick={() => goToSection(sec)}
          >
            {sec}
          </Button>
        ))}
      </div>
    </header>
  );
};

export default TestHeader;
