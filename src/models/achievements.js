const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  apiname: { type: String },
  achieved: { type: Boolean },
  globalAchievementPercentage: { type: String },
  unlocktime: { type: Date },
  icon: { type: String },
});

module.exports =
  mongoose.models.Achievement ||
  mongoose.model("Achievement", achievementSchema);
