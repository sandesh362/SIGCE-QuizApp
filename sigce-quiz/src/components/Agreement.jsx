// src/components/Agreement.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Agreement = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">Quiz Agreement</h1>
        <p className="mb-4 text-gray-700">
          By proceeding, you agree not to cheat and understand that any violations will result in the quiz being automatically closed.
        </p>
        <button
          onClick={handleStartQuiz}
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default Agreement;
