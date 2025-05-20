const express =  require('express');
const { getFeedbackByTopic, submitFeedback } = require('../controllers/feedbackController.js');


const router = express.Router();

router.get('/byTopic/:topicId', getFeedbackByTopic);
router.post('/:topicId', submitFeedback);

module.exports = router;
