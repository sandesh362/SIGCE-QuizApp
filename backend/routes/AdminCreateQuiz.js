const route = require('express').Router();
const {CreateQuiz, UpdateQuiz, DeleteQuiz} = require('../controller/AdminCreateQuiz');

route.post('/create', CreateQuiz);

route.put('/update/:id', UpdateQuiz);

route.delete('/delete/:id', DeleteQuiz);