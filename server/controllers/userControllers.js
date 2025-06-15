const User = require('../models/User');
const Course = require('../models/Course');
const  calculateUserProgress  = require('../utils/progressCalculator.js');
const mongoose = require('mongoose'); 
const Topic = require('../models/Topic');

exports.registerUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.enrollInCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId).populate('languages');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(userId);

    const alreadyEnrolled = user.enrolledCourses.some(
      (enrolled) => enrolled.course.toString() === courseId
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Initialize each language with empty completedTopics
    const enrolledLanguages = course.languages.map((lang) => ({
      language: lang._id,
      completedTopics: [],
    }));

    user.enrolledCourses.push({
      course: course._id,
      languages: enrolledLanguages,
      courseProgress: 0,
    });

    await user.save();

    res.status(200).json({ message: 'Enrolled in course successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to enroll in course', error: err.message });
  }
};



exports.markTopicAsCompleted = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, languageId, topicId } = req.body;

    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    const user = await User.findById(userId);

    const enrolledCourse = user.enrolledCourses.find(ec => ec.course.toString() === courseId);
    if (!enrolledCourse) return res.status(404).json({ message: 'Course not enrolled' });

    const enrolledLanguage = enrolledCourse.languages.find(l => l.language.toString() === languageId);
    if (!enrolledLanguage) return res.status(404).json({ message: 'Language not enrolled in course' });

    // Add topic to completedTopics (if not already added)
    const alreadyCompleted = enrolledLanguage.completedTopics.some(id => id.toString() === topicId);
    if (!alreadyCompleted) {
      enrolledLanguage.completedTopics.push(topicId);
    }

    // Recalculate progress and award badges
    const { newlyEarnedBadges } = await calculateUserProgress(user);

    // Save the updated user document
    await user.save();

    // Repopulate user with necessary details
    const freshUser = await User.findById(user._id)
      .populate({
        path: 'enrolledCourses.course',
        model: 'Course',
      })
      .populate({
        path: 'enrolledCourses.languages.language',
        model: 'Language',
      })
      .populate({
        path: 'earnedBadges.badge',
        model: 'Badge', // Optional: include if you want badge details in frontend
      });

    res.status(200).json({ 
      message: 'Topic marked as completed', 
      user: freshUser, 
      newlyEarnedBadges // Frontend can use this to trigger animation
    });

  } catch (err) {
    console.error('Error marking topic as completed:', err);
    res.status(500).json({ message: 'Failed to mark topic as completed', error: err.message });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate({
        path: 'enrolledCourses.course',
        model: 'Course',
      })
      .populate({
        path: 'enrolledCourses.languages.language',
        model: 'Language',
      });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ enrolledCourses: user.enrolledCourses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch enrolled courses', error: err.message });
  }
};




