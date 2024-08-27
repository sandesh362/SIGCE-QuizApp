const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String  // Change to String if the answer is a text value
});

const quizSchema = new mongoose.Schema({
  title: String,
  questions: [questionSchema],
  id: { type: Number, required: true }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
