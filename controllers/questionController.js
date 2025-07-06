const Question = require('../models/Question');

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ date: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createQuestion = async (req, res) => {
  const { question_text } = req.body;
  const userId = req.user.id;

  try {
    const newQuestion = new Question({ question_text, user_id: userId });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (question.user_id.toString() !== userId)
      return res.status(403).json({ message: 'Not authorized to delete this question' });

    await Question.findByIdAndDelete(id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};