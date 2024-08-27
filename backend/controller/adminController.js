const mongoose = require('mongoose')
const Quiz = require('../models/Questions');
const User = require('../models/Users');

// Generate a unique 4-digit ID
const generateFourDigitId = () => Math.floor(1000 + Math.random() * 9000);

const createQuiz = async (req, res) => {
  const { title, questions } = req.body;

  try {
    // Convert answers to numbers if required
    const formattedQuestions = questions.map(q => ({
      ...q,
      answer: Number(q.answer)  // Convert answer to a number
    }));

    const quiz = new Quiz({
      title,
      questions: formattedQuestions,
      id: Math.floor(1000 + Math.random() * 9000)  // Generate a unique 4-digit ID
    });

    await quiz.save();
    res.status(201).json({ message: 'Quiz created successfully', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Error creating quiz', error: err.message });
  }
};

const updateQuestion = async (req, res) => {
  const { quizId, questionIndex } = req.params;
  const { question, options, answer } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    if (questionIndex >= quiz.questions.length) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const questionToUpdate = quiz.questions[questionIndex];
    questionToUpdate.question = question || questionToUpdate.question;
    questionToUpdate.options = options || questionToUpdate.options;
    questionToUpdate.answer = answer || questionToUpdate.answer;

    await quiz.save();
    res.status(200).json({ message: 'Question updated successfully', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Error updating question', error: err.message });
  }
};

const deleteQuestion = async (req, res) => {
  const { quizId, questionIndex } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    if (questionIndex >= quiz.questions.length) {
      return res.status(404).json({ message: 'Question not found' });
    }

    quiz.questions.splice(questionIndex, 1);
    await quiz.save();
    res.status(200).json({ message: 'Question deleted successfully', quiz });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting question', error: err.message });
  }
};

const deleteQuiz = async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    await Quiz.findByIdAndDelete(quizId);
    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting quiz', error: err.message });
  }
};

const getTopPlayers = async (req, res) => {
  const { quizId } = req.params;

  try {
    // Validate the quizId format if necessary
    // if (!mongoose.Types.ObjectId.isValid(quizId)) {
    //   return res.status(400).json({ message: 'Invalid quiz ID format' });
    // }

    const users = await User.aggregate([
      { $unwind: "$quizzesTaken" },
      { $match: { "quizzesTaken.quizId": quizId } }, // Directly use quizId without ObjectId conversion
      { $sort: { "quizzesTaken.score": -1 } },
      { $group: {
          _id: "$_id",
          name: { $first: "$name" },
          topScore: { $max: "$quizzesTaken.score" }
      }},
      { $sort: { topScore: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({ topPlayers: users });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching top players', error: err.message });
  }
};


const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quizzes', error: err.message });
  }
};

module.exports = { createQuiz, updateQuestion, deleteQuestion, deleteQuiz, getTopPlayers, getAllQuizzes };
