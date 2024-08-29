const route = require('express').Router();

const Question = require('../models/Question');

route.get('/get', async (req, res) => {
    try {
        const quize = await Question.find();
        res.json(quize);
    } catch (err) {
        res.json({ message: err });
    }
}
);