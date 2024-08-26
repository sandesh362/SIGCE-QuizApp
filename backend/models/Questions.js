const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const quizSchema = new mongoose.Schema({
  questions: {
    type: [questionSchema],
    required: true
  }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
