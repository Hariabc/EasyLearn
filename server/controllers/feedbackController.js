const Feedback = require('../models/Feedback');

exports.getFeedbackByTopic = async (req, res) => {
  try {
    const feedback = await Feedback.find({ topic: req.params.topicId });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
