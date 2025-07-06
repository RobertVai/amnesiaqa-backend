const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getAllQuestions,
  createQuestion,
  deleteQuestion,
} = require('../controllers/questionController');

router.get('/questions', getAllQuestions);
router.post('/question', auth, createQuestion);
router.delete('/question/:id', auth, deleteQuestion);

module.exports = router;