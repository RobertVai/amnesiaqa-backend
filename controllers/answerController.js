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

const getAnswersCountByQuestionId = async (req, res) => {
  try {
    const questionId = req.params.id;
    const count = await Answer.countDocuments({ question_id: questionId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get answers count' });
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
    const alreadyDisliked = answer.dislikedBy.includes(userId);

    if (alreadyLiked) {
      answer.likedBy = answer.likedBy.filter(uid => uid.toString() !== userId);
    } else {
      answer.likedBy.push(userId);
      if (alreadyDisliked) {
        answer.dislikedBy = answer.dislikedBy.filter(uid => uid.toString() !== userId);
      }
    }

    answer.likes = answer.likedBy.length;
    answer.dislikes = answer.dislikedBy.length;

    await answer.save();
    res.json({
      likes: answer.likes,
      dislikes: answer.dislikes,
      likedBy: answer.likedBy,
      dislikedBy: answer.dislikedBy,
      currentUserId: userId,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle like on answer' });
  }
};

const toggleDislike = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    const userId = req.user.id;

    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const alreadyLiked = answer.likedBy.includes(userId);
    const alreadyDisliked = answer.dislikedBy.includes(userId);

    if (alreadyDisliked) {
      answer.dislikedBy = answer.dislikedBy.filter(uid => uid.toString() !== userId);
    } else {
      answer.dislikedBy.push(userId);
      if (alreadyLiked) {
        answer.likedBy = answer.likedBy.filter(uid => uid.toString() !== userId);
      }
    }

    answer.likes = answer.likedBy.length;
    answer.dislikes = answer.dislikedBy.length;

    await answer.save();
    res.json({
      likes: answer.likes,
      dislikes: answer.dislikes,
      likedBy: answer.likedBy,
      dislikedBy: answer.dislikedBy,
      currentUserId: userId,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle dislike on answer' });
  }
};

module.exports = {
  getAnswersByQuestionId,
  getAnswersCountByQuestionId,
  createAnswer,
  deleteAnswer,
  toggleLike,
  toggleDislike,
};
