const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    Year: {
        type: String,
        required: true
    },
    Department: {
        type: String,
        required: true
    },
    regId: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    // Array to store multiple quiz results
    quizzesTaken: [
    {
      quizId: { type: String }, // Change this from ObjectId to String
      score: { type: Number },
      resultArray: { type: [Number] },
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
