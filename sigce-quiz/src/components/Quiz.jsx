import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import QuizApp from './QuizApp';

const Quiz = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [violationFound, setViolationFound] = useState(false);

  useEffect(() => {
    const handleKeydown = (event) => {
      const key = event.key || event.keyCode;

      if (
        key === 'F12' ||
        (event.ctrlKey && event.shiftKey && (key === 'I' || key === 'J')) ||
        (event.ctrlKey && key === 'r') ||
        (event.key === 'F11' && event.metaKey) ||
        (event.ctrlKey && event.key)
      ) {
        event.preventDefault();
        return false;
      }
    };

    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    const handleFullscreenChange = () => {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        setIsFullscreen(true);
        toast.success('You are in Fullscreen Mode');
      } else {
        setIsFullscreen(false);
        handleViolation();
      }
    };

    const handleViolation = () => {
      const newViolationCount = violationCount + 1;
      setViolationCount(newViolationCount);
      if (newViolationCount === 3) {
        toast.error('Violation detected. The quiz will now be submitted.');
        setViolationFound(true);
        submitQuiz();
      } else {
        toast.error(`Violation detected! This is your ${newViolationCount} violation.`);
      }
    };

    const checkFullscreenStatus = () => {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement
      ) {
        handleViolation();
        handleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    const fullscreenCheckInterval = setInterval(checkFullscreenStatus, 1000);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      clearInterval(fullscreenCheckInterval);
    };
  }, [violationCount]);

  const handleFullscreen = () => {
    const doc = document.documentElement;
    if (doc.requestFullscreen) {
      doc.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else if (doc.webkitRequestFullscreen) {
      doc.webkitRequestFullscreen();
      setIsFullscreen(true);
    } else if (doc.mozRequestFullScreen) {
      doc.mozRequestFullScreen();
      setIsFullscreen(true);
    } else if (doc.msRequestFullscreen) {
      doc.msRequestFullscreen();
      setIsFullscreen(true);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full text-center">
        {!quizStarted ? (
          <div>
            <h1 className="text-2xl font-semibold mb-4">Welcome to the Quiz</h1>
            <p className="mb-4">Please enter fullscreen mode to start the quiz.</p>
            <button
              onClick={isFullscreen ? null : handleFullscreen}
              className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
            >
              {isFullscreen ? 'Fullscreen Enabled' : 'Enter Fullscreen'}
            </button>
            {isFullscreen && (
              <button
                onClick={startQuiz}
                className="mt-4 py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
              >
                Start Quiz
              </button>
            )}
          </div>
        ) : (
          <QuizApp violationFound={violationFound}/>
        )}
      </div>
    </div>
  );
};

export default Quiz;
