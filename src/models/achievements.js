const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  apiname: { type: String, required: true },
  achieved: { type: Boolean, required: true },
  globalAchievementPercentage: { type: Number },
  unlocktime: { type: Date },
  icon: { type: String },
});

module.exports =
  mongoose.models.Achievement ||
  mongoose.model("Achievement", achievementSchema);
