const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },        // e.g. "Course Completion: JavaScript"
  type: { type: String, enum: ['course', 'language'], required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },     // Badge related to this course (optional for language badges)
  language: { type: mongoose.Schema.Types.ObjectId, ref: 'Language' }, // Badge related to this language (optional for course badges)
  iconUrl: { type: String },                      // URL or path for badge icon/image
  description: { type: String },                  // Badge description
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);
