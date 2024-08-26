import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    answer: ''
  });

  useEffect(() => {
    // Fetch existing questions from the server
    axios.get('http://localhost:3030/quizzes') // Assuming you have an endpoint to get all quizzes
      .then(res => {
        setQuestions(res.data.questions || []);
      })
      .catch(err => {
        console.error('Error fetching quizzes:', err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion(prev => ({ ...prev, options: updatedOptions }));
  };

  const handleAddQuestion = () => {
    axios.post('http://localhost:3030/admin/create', { questions: [newQuestion] })
      .then(res => {
        setQuestions(prev => [...prev, { ...newQuestion, id: res.data.quiz._id }]);
        setNewQuestion({ question: '', options: ['', '', '', ''], answer: '' });
      })
      .catch(err => {
        console.error('Error creating quiz:', err);
      });
  };

  const handleDeleteQuestion = (id) => {
    axios.delete(`http://localhost:3030/admin/delete-question/${id}`)
      .then(() => {
        setQuestions(prev => prev.filter(q => q.id !== id));
      })
      .catch(err => {
        console.error('Error deleting question:', err);
      });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Question</h2>
        <input
          type="text"
          name="question"
          value={newQuestion.question}
          onChange={handleInputChange}
          placeholder="Question"
          className="block w-full mb-4 p-2 border border-gray-300 rounded-lg"
        />
        {newQuestion.options.map((option, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="block w-full mb-1 p-2 border border-gray-300 rounded-lg"
            />
          </div>
        ))}
        <select
          name="answer"
          value={newQuestion.answer}
          onChange={handleInputChange}
          className="block w-full mb-4 p-2 border border-gray-300 rounded-lg"
        >
          <option value="" disabled>Select correct answer</option>
          {newQuestion.options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        <button
          onClick={handleAddQuestion}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Add Question
        </button>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Questions</h2>
        <ul className="list-disc pl-5">
          {questions.map((q) => (
            <li key={q.id} className="mb-4">
              <div className="text-lg font-semibold mb-2">{q.question}</div>
              <ul className="list-inside pl-5 mb-2">
                {q.options.map((option, index) => (
                  <li key={index} className={`p-1 ${option === q.answer ? 'text-green-600' : ''}`}>{option}</li>
                ))}
              </ul>
              <button
                onClick={() => handleDeleteQuestion(q.id)}
                className="py-1 px-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
