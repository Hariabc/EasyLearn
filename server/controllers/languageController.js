const Language = require('../models/Language');

exports.getLanguagesByCourse = async (req, res) => {
  try {
    const languages = await Language.find({ course: req.params.courseId });
    res.json(languages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLanguageById = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }
    res.json(language);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
