const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  enrolledCourses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    languages: [{
      language: { type: mongoose.Schema.Types.ObjectId, ref: "Language" },
      completedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
      isCompleted: { type: Boolean, default: false },
      completionPercent: { type: Number, default: 0 },
      badgeAwarded: { type: Boolean, default: false }  // Track language badge awarded
    }],
    completedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
    isCompleted: { type: Boolean, default: false },
    completionPercent: { type: Number, default: 0 },
    badgeAwarded: { type: Boolean, default: false },  // Track course badge awarded
    startedAt: { type: Date, default: Date.now }
  }],

  earnedBadges: [{
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge"
    },
    awardedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
