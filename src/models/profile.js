const mongoose = require("mongoose");

// User profile schema
const profileSchema = new mongoose.Schema({
  steamid: { type: String },
  avatar: { type: String },
  personaname: { type: String },
  profileurl: { type: String },
  timecreated: { type: Date },
  loccountrycode: { type: String },
  locstatecode: { type: String },
  loccityid: { type: Number },
  personastateflags: { type: Number },
  steamLevel: { type: Number },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
});

module.exports =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);


//usar mongoose.schema.Types.ObjectId quando é algo partilhado entre vários documentos, ex: géneros dos jogos
//usar [SchemaName.schema] quando é algo específico daquele documento, ex: achievements de um jogo específico
