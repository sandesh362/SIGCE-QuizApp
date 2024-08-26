const route = require('express').Router();
const { updateQuestion, createQuiz, deleteQuestion, deleteQuiz, addUser } = require('../controller/adminController');

route.put('/update-question/:quizId/:questionId', updateQuestion);
route.post('/create', createQuiz);
route.delete('/delete-question', deleteQuestion);
route.delete('/delete-quiz', deleteQuiz);

route.post('/adduser', addUser);

module.exports = route;