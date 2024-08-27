import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    questions: [
      { question: '', options: ['', '', '', ''], answer: '' }
    ]
  });
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    // Fetch all quizzes
    axios.get('http://localhost:3030/admin/quizzes')
      .then(res => {
        if (Array.isArray(res.data)) {
          setQuizzes(res.data);
        } else {
          console.error('Invalid data format:', res.data);
          toast.error('invalid data format');
        }
      })
      .catch(err => {
        console.error('Error fetching quizzes:', err);
        toast.error('Error fetching quizzes');
      });
  }, []);

  const handleQuizTitleChange = (e) => {
    setNewQuiz(prev => ({ ...prev, title: e.target.value }));
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[index][name] = value;
    setNewQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...newQuiz.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setNewQuiz(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleAddQuestion = () => {
    setNewQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', options: ['', '', '', ''], answer: '' }]
    }));
  };

  const handleCreateQuiz = () => {
    axios.post('http://localhost:3030/admin/create-quiz', newQuiz)
      .then(res => {
        if (res.data.quiz) {
          setQuizzes(prev => [...prev, res.data.quiz]);
          setNewQuiz({ title: '', questions: [{ question: '', options: ['', '', '', ''], answer: '' }] });
          toast.success('Quiz created successfully');
        } else {
          console.error('Invalid data format:', res.data);
          toast.error('Error creating quiz');
        }
      })
      .catch(err => {
        console.error('Error creating quiz:', err);
        toast.error('Error creating quiz');
      });
  };

  const handleDeleteQuiz = (quizId) => {
    axios.delete(`http://localhost:3030/admin/delete-quiz/${quizId}`)
      .then(() => {
        setQuizzes(prev => prev.filter(q => q._id !== quizId));
        toast.success('Quiz deleted successfully');
      })
      .catch(err => {
        console.error('Error deleting quiz:', err);
        toast.error('Error deleting quiz');
      });
  };

  const handleSelectQuiz = (quizId) => {
    setSelectedQuiz(quizId);
    axios.get(`http://localhost:3030/admin/top-players/${quizId}`)
      .then(res => {
        if (Array.isArray(res.data.topPlayers)) {
          setTopPlayers(res.data.topPlayers);
        } else {
          console.error('Invalid data format:', res.data);
          toast.error('Error fetching top players');
        }
      })
      .catch(err => {
        console.error('Error fetching top players:', err);
        toast.error('Error fetching top players');
      });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Create New Quiz</h2>
        <input
          type="text"
          name="title"
          value={newQuiz.title}
          onChange={handleQuizTitleChange}
          placeholder="Quiz Title"
          className="block w-full mb-4 p-2 border border-gray-300 rounded-lg"
        />
        {newQuiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-6">
            <input
              type="text"
              name="question"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              placeholder={`Question ${qIndex + 1}`}
              className="block w-full mb-4 p-2 border border-gray-300 rounded-lg"
            />
            {q.options.map((option, oIndex) => (
              <div key={oIndex} className="mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  placeholder={`Option ${oIndex + 1}`}
                  className="block w-full mb-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
            <select
              name="answer"
              value={q.answer}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              className="block w-full mb-4 p-2 border border-gray-300 rounded-lg"
            >
              <option value="" disabled>Select correct answer</option>
              {q.options.map((option, oIndex) => (
                <option key={oIndex} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={handleAddQuestion}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 mb-4"
        >
          Add Another Question
        </button>
        <button
          onClick={handleCreateQuiz}
          className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
        >
          Create Quiz
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Quizzes</h2>
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white p-6 rounded-lg shadow-lg mb-4">
              <h3 className="text-xl font-semibold mb-2">{quiz.title} - ID: {quiz.id}</h3>
              <button
                onClick={() => handleSelectQuiz(quiz.id)}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-2"
              >
                Show Top Players
              </button>
              <button
                onClick={() => handleDeleteQuiz(quiz._id)}
                className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete Quiz
              </button>
            </div>
          ))
        ) : (
          <p>No quizzes available.</p>
        )}
      </div>

      {selectedQuiz && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Top Players for Selected Quiz</h2>
          <ul>
            {topPlayers.length > 0 ? (
              topPlayers.map((player) => (
                <li key={player._id} className="bg-white p-4 rounded-lg shadow-lg mb-2">
                  <div className="font-semibold">{player.name}</div>
                  <div>{player.email}</div>
                  <div>Top Score: {player.topScore}</div>
                </li>
              ))
            ) : (
              <p>No top players available for this quiz.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
