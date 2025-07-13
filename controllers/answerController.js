const Answer = require('../models/Answer');
const User = require('../models/user');

const getAnswersByQuestionId = async (req, res) => {
  try {
    const questionId = req.params.id;
    const answers = await Answer.find({ question_id: questionId });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get answers' });
  }
};

const createAnswer = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { text } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newAnswer = new Answer({
      text,
      question_id: questionId,
      user_id: userId,
      user_name: user.name,
    });

    await newAnswer.save();
    res.status(201).json(newAnswer);
  } catch (error) {
    console.error('❌ Failed to create answer:', error);
    res.status(500).json({ error: 'Failed to create answer' });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;
    const userId = req.user.id;

    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    if (answer.user_id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this answer' });
    }

    await Answer.findByIdAndDelete(answerId);
    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete answer' });
  }
};

const toggleLike = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const userId = req.user.id;

    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const alreadyLiked = answer.likedBy.includes(userId);

    if (alreadyLiked) {
      answer.likedBy = answer.likedBy.filter(uid => uid.toString() !== userId);
      answer.likes -= 1;
    } else {
      answer.likedBy.push(userId);
      answer.likes += 1;
    }

    await answer.save();
    res.json({
      likes: answer.likes,
      likedBy: answer.likedBy,
      currentUserId: userId,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like answer' });
  }
};

const toggleDislike = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const userId = req.user.id;

    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const alreadyDisliked = answer.dislikedBy.includes(userId);

    if (alreadyDisliked) {
      answer.dislikedBy = answer.dislikedBy.filter(uid => uid.toString() !== userId);
      answer.dislikes -= 1;
    } else {
      answer.dislikedBy.push(userId);
      answer.dislikes += 1;
    }

    await answer.save();
    res.json({
      dislikes: answer.dislikes,
      dislikedBy: answer.dislikedBy,
      currentUserId: userId,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to dislike answer' });
  }
};

module.exports = {
  getAnswersByQuestionId,
  createAnswer,
  deleteAnswer,
  toggleLike,
  toggleDislike,
};