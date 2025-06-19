const express = require('express'); 
const { getTopicsByLanguage, getTopicById } = require('../controllers/topicController.js');

const router = express.Router();

router.get('/:languageId', getTopicsByLanguage);
router.get('/topicById/:id', getTopicById);

router.get('/user-progress/:userId/:languageId', async (req, res) => {
  const { userId, languageId } = req.params;

  try {
    const progress = await UserProgress.findOne({ userId, languageId });

    if (!progress) {
      return res.status(200).json({ completedTopics: [] }); // return empty if no progress yet
    }

    res.status(200).json({
      completedTopics: progress.completedTopics || [],
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;