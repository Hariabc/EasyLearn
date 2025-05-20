const Language = require('../models/Language');

exports.getLanguagesByCourse = async (req, res) => {
  try {
    const languages = await Language.find({ course: req.params.courseId });
    res.json(languages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
