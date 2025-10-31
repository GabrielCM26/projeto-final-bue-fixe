const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  id: { type: Number},
  description: { type: String },
});

module.exports = mongoose.models.Genre || mongoose.model("Genre", genreSchema);
