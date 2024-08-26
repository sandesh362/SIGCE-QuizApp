// src/QuizSecurity.js

export const enterFullScreen = () => {
    const doc = document.documentElement;
    if (doc.requestFullscreen) {
      doc.requestFullscreen();
    } else if (doc.webkitRequestFullscreen) { // For older WebKit
      doc.webkitRequestFullscreen();
    } else if (doc.mozRequestFullScreen) { // For older Mozilla
      doc.mozRequestFullScreen();
    } else if (doc.msRequestFullscreen) { // For IE/Edge
      doc.msRequestFullscreen();
    }
  };
  
  export const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // For older WebKit
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) { // For older Mozilla
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) { // For IE/Edge
      document.msExitFullscreen();
    }
  };
  
  export const isFullScreen = () => {
    return !!(document.fullscreenElement ||
              document.webkitFullscreenElement ||
              document.mozFullScreenElement ||
              document.msFullscreenElement);
  };
  
  export const preventExitFullScreen = (onViolation) => {
    let violationCount = 0;
    const threshold = 3; // Number of allowed violations
  
    const handleKeydown = (event) => {
      const key = event.key || event.keyCode;
  
      // Block F12, Ctrl+Shift+I/J, Ctrl+R, Fn+F11, and any Ctrl key combinations
      if (
        key === 'F12' ||
        (event.ctrlKey && event.shiftKey && (key === 'I' || key === 'J')) ||
        (event.ctrlKey && key === 'r') ||
        (key === 'F11' && (event.metaKey || event.ctrlKey)) || // Handle metaKey if applicable (macOS)
        (event.ctrlKey && key) // Block all Ctrl key combinations
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
      if (isFullScreen()) {
        // Fullscreen mode is active
        violationCount = 0; // Reset violation count if in fullscreen
      } else {
        // Fullscreen mode exited
        violationCount++;
        if (violationCount >= threshold) {
          onViolation();
        } else {
          alert('You are out of fullscreen mode! Please return to fullscreen to continue.');
          enterFullScreen(); // Attempt to re-enter fullscreen
        }
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
  
    // Initial fullscreen attempt
    enterFullScreen();
  
    // Cleanup event listeners
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  };
  