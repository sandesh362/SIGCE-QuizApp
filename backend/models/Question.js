const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
});

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    options: {
        type: [optionSchema],
        required: true,
    },
    answerIndex: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Question', questionSchema);