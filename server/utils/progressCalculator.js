// progressCalculator.js
const mongoose = require('mongoose');
const Language = require('../models/Language');
const Topic = require('../models/Topic');
const Course = require('../models/Course');

async function calculateUserProgress(user) {
  for (const courseData of user.enrolledCourses) {
    let totalLanguages = courseData.languages.length;
    let completedLanguages = 0;
    let totalCourseTopics = 0;
    let totalCompletedCourseTopics = 0;

    for (const langData of courseData.languages) {
      const languageId = langData.language;
      const completedTopicIds = langData.completedTopics.map(id => id.toString());

      // Get total topics for this language
      const topicsInLanguage = await Topic.find({ language: languageId }).select('_id');
      const totalTopics = topicsInLanguage.length;

      // Count completed topics that exist in the language
      const validCompletedCount = topicsInLanguage.filter(topic =>
        completedTopicIds.includes(topic._id.toString())
      ).length;

      // Update language progress
      langData.completionPercent = totalTopics === 0 ? 0 : (validCompletedCount / totalTopics) * 100;
      langData.isCompleted = totalTopics !== 0 && validCompletedCount === totalTopics;

      // Count toward course-level progress
      totalCourseTopics += totalTopics;
      totalCompletedCourseTopics += validCompletedCount;
      if (langData.isCompleted) completedLanguages++;
    }

    // Update course progress
    courseData.completionPercent = totalCourseTopics === 0 ? 0 : (totalCompletedCourseTopics / totalCourseTopics) * 100;
    courseData.isCompleted = totalCourseTopics !== 0 && totalCompletedCourseTopics === totalCourseTopics;

    // Optional: update flat completedTopics array at course level
    courseData.completedTopics = [
      ...new Set(courseData.languages.flatMap(l => l.completedTopics.map(id => id.toString())))
    ];
  }

  return user;
}

module.exports = calculateUserProgress;
