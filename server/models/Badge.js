const mongoose = require('mongoose');
const badgeSchema = new mongoose.Schema({
  title: String,
  icon: String,
  description: String,
  criteria: String, // e.g. "Completed 5 topics", "Scored 90% in a quiz"
});

module.exports = mongoose.model("Badge", badgeSchema);



