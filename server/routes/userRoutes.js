const express = require('express');

const { register, login} = require('../controllers/authController.js');
const auth = require('../middleware/auth');

const { enrollInCourse , getEnrolledCourses, markTopicAsCompleted } = require('../controllers/userControllers.js');





const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id', auth, getEnrolledCourses);
router.post('/enroll', auth, enrollInCourse);
router.post('/markComplete', auth, markTopicAsCompleted);


module.exports = router;