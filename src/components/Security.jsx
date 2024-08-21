import React, { useState, useEffect } from 'react';

const Security = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeydown = (event) => {
      const key = event.key || event.keyCode;

      // Block F12, Ctrl+Shift+I/J, Ctrl+R, Fn+F11, and any Ctrl key combinations
      if (
        key === 'F12' ||
        (event.ctrlKey && event.shiftKey && (key === 'I' || key === 'J')) ||
        (event.ctrlKey && key === 'r') ||
        (event.key === 'F11' && event.metaKey) || // Handle metaKey if applicable (macOS)
        (event.ctrlKey && event.key) // Block all Ctrl key combinations
      ) {
        event.preventDefault();
        return false;
      }
    };

    const handleBeforeUnload = (event) => {
      // Prevent the page from being unloaded
      event.preventDefault();
      event.returnValue = ''; // Required for some browsers to show a confirmation dialog
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
      } else {
        setIsFullscreen(false);
        // Attempt to re-enter fullscreen mode if it was exited
        handleFullscreen();
      }
    };

    const checkFullscreenStatus = () => {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement
      ) {
        // If not in fullscreen, re-enter fullscreen
        handleFullscreen();
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Set an interval to regularly check fullscreen status
    const fullscreenCheckInterval = setInterval(checkFullscreenStatus, 1000);

    // Cleanup event listeners and interval
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      clearInterval(fullscreenCheckInterval);
    };
  }, []);

  const handleFullscreen = () => {
    const doc = document.documentElement;
    if (doc.requestFullscreen) {
      doc.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(error => console.error('Error entering fullscreen:', error));
    } else if (doc.webkitRequestFullscreen) { // For older WebKit
      doc.webkitRequestFullscreen();
      setIsFullscreen(true);
    } else if (doc.mozRequestFullScreen) { // For older Mozilla
      doc.mozRequestFullScreen();
      setIsFullscreen(true);
    } else if (doc.msRequestFullscreen) { // For IE/Edge
      doc.msRequestFullscreen();
      setIsFullscreen(true);
    }
  };

  const handleExitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(error => console.error('Error exiting fullscreen:', error));
    } else if (document.webkitExitFullscreen) { // For older WebKit
      document.webkitExitFullscreen();
      setIsFullscreen(false);
    } else if (document.mozCancelFullScreen) { // For older Mozilla
      document.mozCancelFullScreen();
      setIsFullscreen(false);
    } else if (document.msExitFullscreen) { // For IE/Edge
      document.msExitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <button onClick={isFullscreen ? handleExitFullscreen : handleFullscreen}>
      {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
    </button>
  );
};

export default Security;
