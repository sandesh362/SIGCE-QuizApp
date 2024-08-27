const express = require('express');
const router = express.Router();
const { login, getQuiz, submitQuiz } = require('../controller/userController');

router.post('/login', login);
router.get('/get-quiz/:id', getQuiz);
router.post('/submit-quiz', submitQuiz);

module.exports = router;
