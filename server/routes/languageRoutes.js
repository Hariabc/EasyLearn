const express = require('express');
const { getLanguagesByCourse } = require('../controllers/languageController.js');



const router = express.Router();

router.get('/:courseId', getLanguagesByCourse);






router.get('/user-progress/language-completion', async (req, res) => {
  const { userId, courseId } = req.query;

  try {
    const completedLanguagesCount = await UserProgress.countDocuments({
      userId,
      courseId,
      isLanguageCompleted: true
    });

    res.json({ completedLanguagesCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch language progress' });
  }
});



module.exports = router;
