const Topic = require('../models/Topic');
const Badge = require('../models/Badge');

async function calculateUserProgress(user) {
  const newlyEarnedBadges = [];

  // Collect all language IDs from enrolled courses
  const languageIdsSet = new Set();
  user.enrolledCourses.forEach(courseData => {
    courseData.languages.forEach(langData => {
      const langId = langData.language._id ? langData.language._id.toString() : langData.language.toString();
      languageIdsSet.add(langId);
    });
  });
  const languageIds = Array.from(languageIdsSet);

  // Fetch all topics for these languages at once
  const topics = await Topic.find({ language: { $in: languageIds } }, '_id language');

  // Group topics by language ID for quick lookup
  const topicsByLanguage = {};
  for (const topic of topics) {
    const langId = topic.language.toString();
    if (!topicsByLanguage[langId]) {
      topicsByLanguage[langId] = [];
    }
    topicsByLanguage[langId].push(topic._id.toString());
  }

  // Now calculate progress for each course and language without extra DB calls
  for (const courseData of user.enrolledCourses) {
    let totalCourseTopics = 0;
    let totalCompletedCourseTopics = 0;

    for (const langData of courseData.languages) {
      const languageId = langData.language._id ? langData.language._id.toString() : langData.language.toString();
      const completedTopicIds = langData.completedTopics.map(id => id.toString());

      const topicIds = topicsByLanguage[languageId] || [];
      const totalTopics = topicIds.length;

      // Count valid completed topics (only those that exist in the topic list)
      const validCompletedCount = topicIds.filter(id => completedTopicIds.includes(id)).length;

      // Update progress info on language
      langData.completionPercent = totalTopics === 0 ? 0 : (validCompletedCount / totalTopics) * 100;
      langData.isCompleted = totalTopics > 0 && validCompletedCount === totalTopics;

      // Award language badge if completed and not awarded yet
      if (langData.isCompleted && !langData.badgeAwarded) {
        const badge = await Badge.findOne({ type: 'language', language: languageId });

        if (badge && !user.earnedBadges.some(b => b.badge.toString() === badge._id.toString())) {
          user.earnedBadges.push({ badge: badge._id, awardedAt: new Date() });
          newlyEarnedBadges.push(badge);
          langData.badgeAwarded = true;
        }
      }

      totalCourseTopics += totalTopics;
      totalCompletedCourseTopics += validCompletedCount;
    }

    // Update course-level progress
    courseData.completionPercent = totalCourseTopics === 0
      ? 0
      : (totalCompletedCourseTopics / totalCourseTopics) * 100;

    courseData.isCompleted = totalCourseTopics > 0 && totalCompletedCourseTopics === totalCourseTopics;

    // Award course badge if completed and not awarded yet
    if (courseData.isCompleted && !courseData.badgeAwarded) {
      const courseId = courseData.course._id ? courseData.course._id.toString() : courseData.course.toString();
      const badge = await Badge.findOne({ type: 'course', course: courseId });

      if (badge && !user.earnedBadges.some(b => b.badge.toString() === badge._id.toString())) {
        user.earnedBadges.push({ badge: badge._id, awardedAt: new Date() });
        newlyEarnedBadges.push(badge);
        courseData.badgeAwarded = true;
      }
    }

    // Optional: update flat list of completedTopics at course level to unique strings
    courseData.completedTopics = [
      ...new Set(courseData.languages.flatMap(l => l.completedTopics.map(id => id.toString())))
    ];
  }

  return { user, newlyEarnedBadges };
}

module.exports = calculateUserProgress;
