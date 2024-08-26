const mongoose = require('mongoose');

const Quiz = require('../models/Questions');
const User = require('../models/Users');

const createQuiz = async (req, res) => {
    const { questions } = req.body;

    try {
        // Create a new quiz document
        const quiz = new Quiz({ questions });

        // Save the quiz document
        await quiz.save();

        res.status(201).json({ message: 'Quiz created successfully', quiz });
    } catch (err) {
        res.status(500).json({ message: 'Error creating quiz', error: err.message });
    }
}

const updateQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const { question, options, correctOption, points } = req.body;

    try {
        // Find the quiz by ID
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Find the specific question by ID
        const questionToUpdate = quiz.questions.id(questionId);
        if (!questionToUpdate) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Update the fields
        if (question) questionToUpdate.question = question;
        if (options) questionToUpdate.options = options;
        if (correctOption !== undefined) questionToUpdate.correctOption = correctOption;
        if (points !== undefined) questionToUpdate.points = points;

        // Save the updated quiz document
        await quiz.save();

        res.status(200).json({ message: 'Question updated successfully', quiz });
    } catch (err) {
        res.status(500).json({ message: 'Error updating question', error: err.message });
    }
}

const deleteQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;

    try {
        // Find the quiz by ID
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Find the specific question by ID
        const questionToDelete = quiz.questions.id(questionId);
        if (!questionToDelete) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Remove the question
        questionToDelete.remove();

        // Save the updated quiz document
        await quiz.save();

        res.status(200).json({ message: 'Question deleted successfully', quiz });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting question', error: err.message });
    }
}

const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;

    try {
        // Find the quiz by ID
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Remove the quiz
        await quiz.remove();

        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting quiz', error: err.message });
    }
}

const addUser = async (req, res) => {
    const { name, email, Year, Department, regId, dob } = req.body;

    try {
        // Check if a user with the same email already exists
        // const existingUser = await User.findOne({ email });
        // if (existingUser) {
        //     return res.status(400).json({ message: 'User already exists with this email' });
        // }

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            Year,
            Department,
            regId,
            dob
        });

        // Save the user to the database
        await newUser.save();

        // Send a success response
        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (err) {
        // Handle errors
        res.status(500).json({ message: 'Error adding user', error: err.message });
    }
};

module.exports = { updateQuestion, createQuiz, deleteQuestion, deleteQuiz, addUser };