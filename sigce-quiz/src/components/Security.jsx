// src/components/Security.jsx

import {React, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Security = () => {
  const navigate = useNavigate();

  const openQuizWindow = () => {
    const newWindow = window.open('', '', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Quiz</title>
            <meta http-equiv="refresh" content="0;url=/agreement">
            <style>
              body { margin: 0; font-family: Arial, sans-serif; }
              #content { height: 100vh; display: flex; align-items: center; justify-content: center; }
            </style>
          </head>
          <body>
            <div id="content">
              <h1>Loading Quiz...</h1>
            </div>
          </body>
        </html>
      `);

      newWindow.document.close(); // Close the document to finish writing
      newWindow.focus(); // Focus the new window
    }
  };

  useEffect(()=>{
    if(!localStorage.getItem('user')){
    navigate('/')
  }
},[])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">Enter Fullscreen Mode</h1>
        <p className="mb-4 text-gray-700">
          Click the button below to enter fullscreen mode in a new window.
        </p>
        <button
          onClick={() => {
            openQuizWindow();
            navigate('/'); // Navigate to the agreement page
          }}
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Open Quiz Window
        </button>
      </div>
    </div>
  );
};

export default Security;
