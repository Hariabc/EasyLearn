const Topic = require('../models/Topic');

exports.getTopicsByLanguage = async (req, res) => {
  try {
    const topics = await Topic.find({ language: req.params.languageId });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    res.json(topic);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

