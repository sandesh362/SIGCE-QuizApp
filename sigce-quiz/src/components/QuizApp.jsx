import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const QuizApp = () => {
  const [quizId, setQuizId] = useState('');  // Input for Quiz ID
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [resultArray, setResultArray] = useState([]);  // Array to store 1 for correct and 0 for incorrect answers
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quiz, setQuiz] = useState(null);  // Holds the quiz data fetched from the API

  // Function to load quiz data from the API
  const loadQuiz = async () => {
    try {
      const response = await fetch(`http://localhost:3030/user/get-quiz/${quizId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch quiz");
      }

      const quizData = await response.json();
      localStorage.setItem('quizid', quizId);
      setQuiz(quizData.quiz.questions);  // Adjusted to match the response structure
    } catch (error) {
      console.error("Error loading quiz:", error);
    }
  };

  // Function to handle option change
  const handleOptionChange = (index) => {
    setSelectedOptionIndex(index);
  };

  // Function to handle the submission of each question
  const handleSubmit = () => {
    if (selectedOptionIndex !== null) {
      const isCorrect = quiz[currentQuestion].options[selectedOptionIndex] === quiz[currentQuestion].answer;
      
      // Update the resultArray with the new result
      setResultArray((prevResultArray) => {
        const updatedArray = [...prevResultArray, isCorrect ? 1 : 0];
        
        if (currentQuestion < quiz.length - 1) {
          setCurrentQuestion(currentQuestion + 1);  // Move to the next question
          setSelectedOptionIndex(null);  // Reset the selected option
        } else {
          setQuizCompleted(true);  // Mark quiz as completed when all questions are answered
        }

        return updatedArray;  // Return the updated result array
      });
    } else {
      toast.error('Please select an option');
    }
  };

  // Function to calculate the score
  const calculateScore = () => {
    return resultArray.reduce((acc, curr) => acc + curr, 0);  // Sum all the correct answers
  };

  // Function to submit the quiz
  const submitQuiz = async () => {
    const score = calculateScore();  // Calculate the score
    const email = localStorage.getItem('email');
    const quizId = localStorage.getItem('quizid');
    const quizData = {
      email,  // Get the email from local storage
      quizId,
      resultArray,  // This contains 1s and 0s for correct/incorrect answers
      score,  // Total score based on correct answers
    };

    try {
      const response = await fetch('http://localhost:3030/user/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      const data = await response.json();
      localStorage.removeItem('user');
      localStorage.removeItem('email');
      localStorage.removeItem('DOB');
      localStorage.removeItem('regId');
      localStorage.removeItem('quizid');
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }

    setTimeout(() => {
      window.close();  // Close the quiz window after submission
    }, 6000);  // Delay to let the user see the submission
  };

  // Trigger quiz submission when the quiz is completed
  useEffect(() => {
    if (quizCompleted) {
      submitQuiz();
    }
  }, [quizCompleted]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
  <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
    {!quiz ? (
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Unlock Your Quiz Challenge</h1>
            <p className="mb-4">Enter your unique Quiz ID below to embark on a thrilling quiz journey. Let’s see what you’ve got!</p>
        <input
          type="text"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          placeholder="Enter Quiz ID"
          className="border border-gray-300 rounded-lg p-3 mb-4 w-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={loadQuiz}
          className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors duration-300"
        >
          Start My Adventure
        </button>
      </div>
    ) : !quizCompleted ? (
      quiz.length > 0 ? (
        <>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">{quiz[currentQuestion].question}</h2>

          {quiz[currentQuestion].code && (
            <div className="overflow-auto bg-gray-100 p-4 rounded-lg max-h-60 border border-gray-300 shadow-sm">
              <SyntaxHighlighter
                language="javascript"
                style={solarizedlight}
                customStyle={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                }}
              >
                {quiz[currentQuestion].code}
              </SyntaxHighlighter>
            </div>
          )}

          <div className="mt-4">
            {quiz[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center mb-3">
                <input
                  type="radio"
                  id={`option${index}`}
                  name="quizOption"
                  value={option}
                  checked={selectedOptionIndex === index}
                  onChange={() => handleOptionChange(index)}
                  className="mr-3 accent-blue-500"
                />
                <label htmlFor={`option${index}`} className="text-gray-700 text-lg">
                  {option}
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={currentQuestion < quiz.length - 1 ? handleSubmit : () => setQuizCompleted(true)}
            className="w-full py-3 px-5 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition-colors duration-300"
          >
            {currentQuestion < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </>
      ) : (
        <p className="text-center text-gray-700">Loading quiz...</p>
      )
    ) : (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-green-600">Quiz Completed</h2>
        <p className="text-lg text-gray-700 mb-4">Submitting your quiz...</p>
        
        <svg className="w-12 h-12 mt-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10A10 10 0 0 1 12 2zm0 18a8 8 0 0 0 8-8 8 8 0 0 0-8-8 8 8 0 0 0-8 8 8 8 0 0 0 8 8zm4.293-9.707a1 1 0 0 0-1.414 0L12 14.586l-2.879-2.88a1 1 0 0 0-1.414 1.415l3.293 3.293a1 1 0 0 0 1.414 0l5-5a1 1 0 0 0 0-1.415z"/>
        </svg>
      </div>
    )}
  </div>
</div>

  );
};

export default QuizApp;

