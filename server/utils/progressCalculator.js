const Topic = require('../models/Topic');
const Badge = require('../models/Badge');

async function calculateUserProgress(user) {
  const newlyEarnedBadges = [];

  // Step 1: Collect all unique language IDs from user's enrolledCourses
  const languageIdsSet = new Set();
  user.enrolledCourses.forEach(course => {
    course.languages.forEach(lang => {
      const langId = (lang.language?._id || lang.language).toString();
      languageIdsSet.add(langId);
    });
  });
  const languageIds = Array.from(languageIdsSet);

  // Step 2: Fetch all topics grouped by language
  const topics = await Topic.find({ language: { $in: languageIds } }, '_id language');
  const topicsByLanguage = {};
  for (const topic of topics) {
    const langId = topic.language.toString();
    if (!topicsByLanguage[langId]) topicsByLanguage[langId] = [];
    topicsByLanguage[langId].push(topic._id.toString());
  }

  // Step 3: Loop through enrolled courses and update progress
  for (const course of user.enrolledCourses) {
    let totalCourseTopics = 0;
    let totalCompletedCourseTopics = 0;

    for (const lang of course.languages) {
      const langId = (lang.language?._id || lang.language).toString();
      const completedTopicIds = lang.completedTopics.map(id => id.toString());
      const totalTopics = (topicsByLanguage[langId] || []).length;

      const validCompletedCount = (topicsByLanguage[langId] || []).filter(id => completedTopicIds.includes(id)).length;

      // Step 3a: Update language progress
      lang.completionPercent = totalTopics === 0 ? 0 : Math.round((validCompletedCount / totalTopics) * 100);
      lang.isCompleted = totalTopics > 0 && validCompletedCount === totalTopics;

      // Step 3b: Award language badge if eligible
      if (lang.isCompleted && !lang.badgeAwarded) {
        const badge = await Badge.findOne({ type: 'language', language: langId });
        const alreadyEarned = user.earnedBadges.some(b => b.badge.toString() === badge?._id.toString());

        if (badge && !alreadyEarned) {
          user.earnedBadges.push({ badge: badge._id, awardedAt: new Date() });
          newlyEarnedBadges.push(badge);
          lang.badgeAwarded = true;
        }
      }

      totalCourseTopics += totalTopics;
      totalCompletedCourseTopics += validCompletedCount;
    }

    // Step 4: Update course progress
    course.completionPercent = totalCourseTopics === 0
      ? 0
      : Math.round((totalCompletedCourseTopics / totalCourseTopics) * 100);

    course.isCompleted = totalCourseTopics > 0 && totalCompletedCourseTopics === totalCourseTopics;

    // Step 5: Award course badge if eligible
    if (course.isCompleted && !course.badgeAwarded) {
      const courseId = (course.course?._id || course.course).toString();
      const badge = await Badge.findOne({ type: 'course', course: courseId });
      const alreadyEarned = user.earnedBadges.some(b => b.badge.toString() === badge?._id.toString());

      if (badge && !alreadyEarned) {
        user.earnedBadges.push({ badge: badge._id, awardedAt: new Date() });
        newlyEarnedBadges.push(badge);
        course.badgeAwarded = true;
      }
    }

    // Step 6 (optional): Flatten all completed topics at course level
    course.completedTopics = [
      ...new Set(course.languages.flatMap(l => l.completedTopics.map(id => id.toString())))
    ];
  }

  return { user, newlyEarnedBadges };
}

module.exports = calculateUserProgress;
