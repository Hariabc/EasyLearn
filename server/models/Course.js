const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug : { type: String, required: true },
  category: { type: String },
  description: { type: String },
  image: { type: String },
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Language" }],
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);


