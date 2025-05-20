const express = require('express');
const { getQuizByTopic } = require('../controllers/quizController.js');


const router = express.Router();

router.get('/:topicId', getQuizByTopic);
// router.post('/submit/:topicId',  submitQuiz);


module.exports = router;
