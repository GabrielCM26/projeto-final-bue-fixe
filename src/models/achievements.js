const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  steamID: { type: Number, required: true },
  appID: { type: Number, required: true },
  apiName: { type: String, required: true },
  achieved: { type: Boolean, required: true },
  globalAchievementPercentage: { type: Number },
  unlockTime: { type: Date },
  icon: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Achievement ||
  mongoose.model("Achievement", achievementSchema);
