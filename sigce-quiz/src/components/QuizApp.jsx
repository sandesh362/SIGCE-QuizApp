import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const QuizApp = ({ userId, quizId, violationFound }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [resultArray, setResultArray] = useState([]); // Array to store 1 for correct and 0 for incorrect answers
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quiz, setQuiz] = useState([]); // Holds the quiz data fetched from the API

  // Function to load quiz data from the API
  const loadQuiz = async () => {
    try {
      const response = await fetch("http://localhost:3030/user/get-quiz/66cb22f0a5df6b7221d8fe15");

      if (!response.ok) {
        throw new Error("Failed to fetch quiz");
      }

      const quizData = await response.json();
      localStorage.setItem('quizid', "66cb22f0a5df6b7221d8fe15");
      setQuiz(quizData.quiz[0].questions); // Assuming the quiz data contains an array of questions
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
      const isCorrect = quiz[currentQuestion].options[selectedOptionIndex] === quiz[currentQuestion].options[quiz[currentQuestion].answer];
      
      // Update the resultArray with the new result
      setResultArray((prevResultArray) => {
        const updatedArray = [...prevResultArray, isCorrect ? 1 : 0];
        
        if (currentQuestion < quiz.length - 1) {
          setCurrentQuestion(currentQuestion + 1); // Move to the next question
          setSelectedOptionIndex(null); // Reset the selected option
        } else {
          setQuizCompleted(true); // Mark quiz as completed when all questions are answered
        }
  
        return updatedArray; // Return the updated result array
      });
    } else {
      toast.error('Please select an option');
    }
  };
  
  

  // Function to calculate the score
  const calculateScore = () => {
    return resultArray.reduce((acc, curr) => acc + curr, 0); // Sum all the correct answers
  };

  // Function to submit the quiz
  const submitQuiz = async () => {
    const score = calculateScore(); // Calculate the score
    const email = localStorage.getItem('email');
    const quizId = localStorage.getItem('quizid');
    const quizData = {
      email, // Get the email from local storage
      quizId,
      resultArray, // This contains 1s and 0s for correct/incorrect answers
      score, // Total score based on correct answers
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
      window.close(); // Close the quiz window after submission
    }, 6000); // Delay to let the user see the submission
  };

  // Trigger quiz submission when the quiz is completed
  useEffect(() => {
    if (quizCompleted) {
      submitQuiz();
    }
  }, [quizCompleted]);

  // Load the quiz data on component mount
  useEffect(() => {
    loadQuiz();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        {!quizCompleted ? (
          quiz.length > 0 ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">{quiz[currentQuestion].question}</h2>
              <div className="mb-4">
                {quiz[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`option${index}`}
                      name="quizOption"
                      value={option}
                      checked={selectedOptionIndex === index}
                      onChange={() => handleOptionChange(index)}
                      className="mr-2"
                    />
                    <label htmlFor={`option${index}`} className="text-gray-700">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={currentQuestion < quiz.length - 1 ? handleSubmit : async () => {
                  await handleSubmit;
                  setQuizCompleted(true);
                }}
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
              >
                {currentQuestion < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </>
          ) : (
            <p>Loading quiz...</p>
          )
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Quiz Completed</h2>
            <p>Submitting your quiz...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizApp;
