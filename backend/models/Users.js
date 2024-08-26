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
            quizId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Quiz', // Assuming there is a Quiz model
                required: true
            },
            score: {
                type: Number,
                required: true
            },
            resultArray:{
                type: Array,
                required: true
            },
            violationfound: {
                type: Boolean,
                default: false
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
