const mongoose = require('mongoose');
const moment = require('moment');

const User = require('../models/Users');
const Quiz = require('../models/Questions'); // Assuming you have a Quiz model

const login = async (req, res) => {
  const { email, dob } = req.body;

  try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Convert the input dob (MM/DD/YYYY) to a comparable ISO date
      const formattedInputDate = moment(dob, "MM/DD/YYYY").startOf('day').toDate();
      
      // Convert the stored MongoDB ISO date to the start of the day for comparison
      const storedDate = moment(user.dob).startOf('day').toDate();

      // Compare both dates (input and stored)
      if (formattedInputDate.getTime() !== storedDate.getTime()) {
          // Return formatted stored DOB to help the user
          const formattedStoredDob = moment(user.dob).format("MM/DD/YYYY");

          return res.status(400).json({ 
              message: 'DOB not matched', 
              storedDob: formattedStoredDob 
          });
      }

      // If DOB matches, login is successful
      res.status(200).json({ 
          message: 'Login successful', 
          user 
      });
  } catch (err) {
      res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

const getQuiz = async (req, res) => {

    const id = req.params.id;

    try {
        const quiz = await Quiz.find({ _id: id });
        res.status(200).json({ message: 'Quiz found', quiz });
    } catch (err) {
        res.status(500).json({ message: 'Error getting quiz', error: err.message });
    }
}

const submitQuiz = async (req, res) => {
    const { email, quizId, resultArray, score } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        // console.log(email, quizId, resultArray, score);
        return res.status(404).json({ message: 'User not found' });
      }

      console.log(email, quizId, resultArray, score);
  
      user.quizzesTaken.push({
        quizId,
        score,
        resultArray,
      });
  
      await user.save();
      res.status(200).json({ message: 'Quiz results submitted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting quiz results', error });
    }
  };

module.exports = {
    login,
    submitQuiz,
    getQuiz
};
