const express = require('express');
const router = express.Router();
const { login, getQuiz, submitQuiz } = require('../controller/userController'); // Assuming your controller is named userController.js

// POST route for user login
router.post('/login', login);

router.get('/get-quiz/:id', getQuiz);

// POST route for quiz submission
router.post('/submit-quiz', submitQuiz);

module.exports = router;
