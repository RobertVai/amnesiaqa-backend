const express = require('express');
const router = express.Router();
const {
  getAnswersByQuestionId,
  createAnswer,
  deleteAnswer,
} = require('../controllers/answerController');


router.get('/question/:id/answers', getAnswersByQuestionId);
router.post('/question/:id/answers', createAnswer);
router.delete('/answer/:id', deleteAnswer);

module.exports = router;