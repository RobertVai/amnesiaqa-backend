const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getAnswersByQuestionId,
  getAnswersCountByQuestionId,
  createAnswer,
  deleteAnswer,
  toggleDislike,
  toggleLike
} = require('../controllers/answerController');


router.get('/question/:id/answers', getAnswersByQuestionId);

router.get('/question/:id/answers/count', getAnswersCountByQuestionId);


router.post('/question/:id/answers', auth, createAnswer);


router.delete('/answer/:id', auth, deleteAnswer);

router.post('/answer/:id/like', auth, toggleLike);
router.post('/answer/:id/dislike', auth, toggleDislike);

module.exports = router;
