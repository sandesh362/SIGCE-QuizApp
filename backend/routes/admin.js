const express = require('express');
const router = express.Router();
const quizController = require('../controller/adminController');

router.post('/create-quiz', quizController.createQuiz);
router.patch('/update-question/:quizId/:questionIndex', quizController.updateQuestion);
router.delete('/delete-question/:quizId/:questionIndex', quizController.deleteQuestion);
router.delete('/delete-quiz/:quizId', quizController.deleteQuiz);
router.get('/top-players/:quizId', quizController.getTopPlayers);
router.get('/quizzes', quizController.getAllQuizzes);

module.exports = router;
