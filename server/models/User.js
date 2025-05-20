const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  enrolledCourses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    languages: [{
      language: { type: mongoose.Schema.Types.ObjectId, ref: "Language" },
      completedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
      isCompleted: { type: Boolean, default: false },
      completionPercent: { type: Number, default: 0 }
    }],
    completedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
    isCompleted: { type: Boolean, default: false },
    completionPercent: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now }
  }],

  badges: [String],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
