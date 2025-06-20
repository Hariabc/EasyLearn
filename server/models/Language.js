const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true }, // HTML, CSS, JavaScript, etc.
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
}, { timestamps: true });

module.exports = mongoose.model("Language", languageSchema);