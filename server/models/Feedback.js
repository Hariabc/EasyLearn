const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema({
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: String,
  rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);

