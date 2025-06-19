const express = require('express');

const { register, login, updateProfile, changePassword } = require('../controllers/authController.js');
const auth = require('../middleware/auth');

const { enrollInCourse , getEnrolledCourses, markTopicAsCompleted , getUser} = require('../controllers/userControllers.js');
const User = require('../models/User');

const router = express.Router();
router.get('/', auth , getUser);

router.post('/register', register);
router.post('/login', login);
router.get('/:id', auth, getEnrolledCourses);
router.post('/enroll', auth, enrollInCourse);
router.post('/markComplete', auth, markTopicAsCompleted);

router.get('/me/badges', auth, async (req, res) => {
  try {
    // Populate badges with badge details
    const user = await User.findById(req.user._id).populate('earnedBadges.badge');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return only badges array
    res.json({ badges: user.earnedBadges });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch badges', error: error.message });
  }
});


router.post("/test/complete-frontend-course/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const FRONTEND_COURSE_ID = "682da407424c2c617fbe4ddc";

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    let updated = false;

    user.enrolledCourses.forEach((course) => {
      if (course.course.toString() === FRONTEND_COURSE_ID) {
        course.languages.forEach((lang) => {
          lang.isCompleted = true;
          lang.completionPercent = 100;
          lang.badgeAwarded = true;

          // Optionally, simulate topic completion
          // lang.completedTopics = [ ... ]; 
        });
        updated = true;
      }
    });

    if (!updated) {
      return res.status(400).json({ message: "Frontend course not found in user's enrolled courses." });
    }

    await user.save();

    res.json({ message: "Frontend course languages marked as completed.", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Update user profile
router.patch('/me/profile', auth, updateProfile);

// Change user password
router.post('/me/change-password', auth, changePassword);

module.exports = router;