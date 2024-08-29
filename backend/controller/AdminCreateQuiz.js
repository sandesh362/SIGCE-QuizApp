const CreateQuiz = async (req, res) => {
    const question = new Question({
        question: req.body.question,
        description: req.body.description,
        options: req.body.options,
        answerIndex: req.body.answerIndex,
    });

    try {
        const savedQuestion = await question.save();
        res.json(savedQuestion);
    } catch (err) {
        res.json({ message: err });
    }
}

const UpdateQuiz = async (req, res) => {
    try {
        const updatedQuestion = await Question.update
            ({ _id: req.params.id },
                {
                    question: req.body.question,
                    description: req.body.description,
                    options: req.body.options,
                    answerIndex: req.body.answerIndex,
                });
        res.json(updatedQuestion);
    } catch (err) {
        res.json({ message: err });
    }
}

const DeleteQuiz = async (req, res) => {
    try {
        const removedQuestion = await Question.remove({ _id: req.params.id });
        res.json(removedQuestion);
    } catch (err) {
        res.json({ message: err });
    }
}

module.exports = { CreateQuiz, UpdateQuiz, DeleteQuiz };