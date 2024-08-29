const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = 3030;
const connectDB = require('./connection')

app.use(express.json());
app.use(cors());

// Route to submit answers
app.post('/submit', (req, res) => {
    const userAnswers = req.body.answers;
    let score = 0;

    userAnswers.forEach((answer, index) => {
        if (answer === quizQuestions[index].answer) {
            score++;
        }
    });

    res.json({ score: score });
});

app.use('/admin', require('./routes/admin'));
app.use('/user', require('./routes/user'));

// app.get('/quiz', (req, res) => {
//     const filePath = path.join(__dirname, '/questions/Question.json');
//     res.sendFile(filePath);
// });



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});
