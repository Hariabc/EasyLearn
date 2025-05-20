const Quiz = require('../models/Quiz');

exports.getQuizByTopic = async (req, res) => {
  try {
    const quiz = await Quiz.find({ topic: req.params.topicId });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};