const mongoose = require("mongoose");
const Achievement = require("./achievements");

const gameSchema = new mongoose.Schema({
  steamID: { type: Number, unique: true, required: true },
  appID: { type: Number, required: true },
  name: { type: String, required: true },
  img_icon_url: { type: String },
  timePlayed: { type: Number },
  price: { type: Number },
  achievements: [Achievement.schema],
  genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
});

module.exports = mongoose.models.Game || mongoose.model("Game", gameSchema);

//usar mongoose.schema.Types.ObjectId quando é algo partilhado entre vários documentos, ex: géneros dos jogos
//usar [SchemaName.schema] quando é algo específico daquele documento, ex: achievements de um jogo específico
