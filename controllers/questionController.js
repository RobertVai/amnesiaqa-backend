const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/user');

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ date: -1 }).lean();

    
    for (let q of questions) {
      const count = await Answer.countDocuments({ question_id: q._id });
      q.answersCount = count;
    }

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createQuestion = async (req, res) => {
  const { questionText } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newQuestion = new Question({
      questionText,
      user_id: userId,
      userName: user.name
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (question.user_id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    await Question.findByIdAndDelete(id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user.id;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const alreadyLiked = question.likedBy.includes(userId);

    if (alreadyLiked) {
      question.likedBy = question.likedBy.filter(uid => uid.toString() !== userId);
      question.likes -= 1;
    } else {
      if (question.dislikedBy.includes(userId)) {
        question.dislikedBy = question.dislikedBy.filter(uid => uid.toString() !== userId);
        question.dislikes -= 1;
      }
      question.likedBy.push(userId);
      question.likes += 1;
    }

    await question.save();
    res.json({
      likes: question.likes,
      dislikes: question.dislikes,
      likedBy: question.likedBy,
      dislikedBy: question.dislikedBy
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

const toggleDislike = async (req, res) => {
  try {
    const questionId = req.params.id;
    const userId = req.user.id;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const alreadyDisliked = question.dislikedBy.includes(userId);

    if (alreadyDisliked) {
      question.dislikedBy = question.dislikedBy.filter(uid => uid.toString() !== userId);
      question.dislikes -= 1;
    } else {
      if (question.likedBy.includes(userId)) {
        question.likedBy = question.likedBy.filter(uid => uid.toString() !== userId);
        question.likes -= 1;
      }
      question.dislikedBy.push(userId);
      question.dislikes += 1;
    }

    await question.save();
    res.json({
      likes: question.likes,
      dislikes: question.dislikes,
      likedBy: question.likedBy,
      dislikedBy: question.dislikedBy
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle dislike' });
  }
};

module.exports = {
  getAllQuestions,
  createQuestion,
  deleteQuestion,
  toggleLike,
  toggleDislike
};