const Answer = require('../models/Answer');


const getAnswersByQuestionId = async (req, res) => {
  try {
    const questionId = req.params.id;
    const answers = await Answer.find({ questionId });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get answers' });
  }
};


const createAnswer = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { text, author } = req.body;

    const newAnswer = new Answer({
      questionId,
      text,
      author,
    });

    await newAnswer.save();
    res.status(201).json(newAnswer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create answer' });
  }
};


const deleteAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;
    await Answer.findByIdAndDelete(answerId);
    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete answer' });
  }
};

module.exports = {
  getAnswersByQuestionId,
  createAnswer,
  deleteAnswer,
};