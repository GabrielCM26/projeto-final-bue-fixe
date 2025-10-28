const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  description: { type: String },
});

module.exports = mongoose.models.Genre || mongoose.model("Genre", genreSchema);
