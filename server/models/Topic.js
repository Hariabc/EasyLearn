const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: String,
  content: String,
  youtubeLinks: [String],
  notes: String,
  codingQuestions: [String],
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  language: { type: mongoose.Schema.Types.ObjectId, ref: 'Language' }
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
