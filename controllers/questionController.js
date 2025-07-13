const Question = require('../models/Question')


exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ date: -1 })
    res.json(questions)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


exports.createQuestion = async (req, res) => {
  const { questionText } = req.body
  const userId = req.user.id

  try {
    const newQuestion = new Question({
      questionText,         
      user_id: userId,
    })

    await newQuestion.save()
    res.status(201).json(newQuestion)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


exports.deleteQuestion = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    const question = await Question.findById(id)
    if (!question)
      return res.status(404).json({ message: 'Question not found' })

    if (question.user_id.toString() !== userId)
      return res.status(403).json({ message: 'Not authorized to delete this question' })

    await Question.findByIdAndDelete(id)
    res.json({ message: 'Question deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.toggleLike = async (req, res) => {
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
      question.likedBy.push(userId);
      question.likes += 1;
    }

    await question.save();
    res.json({ likes: question.likes, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

exports.toggleDislike = async (req, res) => {
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
      dislikedBy: question.dislikedBy,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle dislike' });
  }
};