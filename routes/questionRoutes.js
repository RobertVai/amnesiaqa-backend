const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getAllQuestions,
  createQuestion,
  deleteQuestion,
  toggleLike,
   toggleDislike, 
} = require('../controllers/questionController');


router.get('/questions', getAllQuestions);


router.post('/question', auth, createQuestion);


router.delete('/question/:id', auth, deleteQuestion);


router.post('/question/:id/like', auth, toggleLike);
router.post('/question/:id/dislike', auth, toggleDislike);

module.exports = router;