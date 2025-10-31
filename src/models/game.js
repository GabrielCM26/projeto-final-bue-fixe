const mongoose = require("mongoose");
const Achievement = require("./achievements");
const { unique } = require("next/dist/build/utils");
const Genre = require("./genre");

const gameSchema = new mongoose.Schema({
  steamid: { type: String },
  appid: { type: Number },
  name: { type: String},
  img_icon_url: { type: String },
  playtime_forever: { type: Number },
  price: { type: String },
  achievements: [Achievement.schema],
  genres: [{id: Number, description: String}],
});


module.exports = mongoose.models.Game || mongoose.model("Game", gameSchema);

//usar mongoose.schema.Types.ObjectId quando é algo partilhado entre vários documentos, ex: géneros dos jogos
//usar [SchemaName.schema] quando é algo específico daquele documento, ex: achievements de um jogo específico
