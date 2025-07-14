const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/user');

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ date: -1 }).lean();

    const updatedQuestions = await Promise.all(
      questions.map(async (q) => {
        const count = await Answer.countDocuments({ question_id: q._id });
        return { ...q, answersCount: count };
      })
    );

    res.json(updatedQuestions);
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
      userName: user.name,
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
    const question = await Question.findById(req.params.id);
    const userId = req.user.id;

    if (!question) return res.status(404).json({ message: "Question not found" });

    const hasLiked = question.likedBy.includes(userId);
    const hasDisliked = question.dislikedBy.includes(userId);

    
    question.likedBy = question.likedBy.filter(id => id.toString() !== userId);
    question.dislikedBy = question.dislikedBy.filter(id => id.toString() !== userId);

    
    if (!hasLiked) {
      question.likedBy.push(userId);
    }

    question.likes = question.likedBy.length;
    question.dislikes = question.dislikedBy.length;

    await question.save();

    res.json({
      likes: question.likes,
      dislikes: question.dislikes,
      likedBy: question.likedBy,
      dislikedBy: question.dislikedBy,
      currentUserId: userId,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle like" });
  }
};

const toggleDislike = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    const userId = req.user.id;

    if (!question) return res.status(404).json({ message: "Question not found" });

    const hasLiked = question.likedBy.includes(userId);
    const hasDisliked = question.dislikedBy.includes(userId);

    
    question.likedBy = question.likedBy.filter(id => id.toString() !== userId);
    question.dislikedBy = question.dislikedBy.filter(id => id.toString() !== userId);

    
    if (!hasDisliked) {
      question.dislikedBy.push(userId);
    }

    question.likes = question.likedBy.length;
    question.dislikes = question.dislikedBy.length;

    await question.save();

    res.json({
      likes: question.likes,
      dislikes: question.dislikes,
      likedBy: question.likedBy,
      dislikedBy: question.dislikedBy,
      currentUserId: userId,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle dislike" });
  }
};
module.exports = {
  getAllQuestions,
  createQuestion,
  deleteQuestion,
  toggleLike,
  toggleDislike,
};