import { useState, useEffect, useCallback, useRef } from 'react';

export const useFullscreen = (elementRef) => {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const internalElementRef = useRef(elementRef); // Use a ref to keep track of the elementRef

  useEffect(() => {
    internalElementRef.current = elementRef; // Update if elementRef prop changes
  }, [elementRef]);

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  const enterFullscreen = useCallback(async () => {
    const element = internalElementRef.current?.current; // Access the actual DOM element
    if (element && document.fullscreenEnabled && !document.fullscreenElement) {
      try {
        await element.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        setIsFullscreen(false); // Ensure state is correct if request fails
      }
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.warn(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
        // State will be updated by fullscreenchange event if successful
      }
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  return { isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen };
};