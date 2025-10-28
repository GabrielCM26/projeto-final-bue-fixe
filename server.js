// ===== CONSTANTES FIXAS =====
const express = require("express");
const next = require("next");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./lib/mongodb");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();
app.use(cors());
app.use(express.json());
const Profile = require("./src/models/profile");
const Game = require("./src/models/game");
const {getPlayerProfiles, getOwnedGames } = require("./lib/steamapi");
const mongoose = require("mongoose");

// ===== ENDPOINTS DA API =====

// ===== GET =====

app.get("/api/profiles/:steamID", async (req, res) => {
  const { steamID } = req.params;

  try {
    const profile = await Profile.find({ steamID });
    if (!profile) {
      return res.status(404).json({ message: "Perfil não encontrado" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

app.get("/api/games/:steamID", async (req, res) => {
  const { steamID } = req.params;

  try {
    const games = await Game.find({ steamID });
    res.json(games);
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// ===== POST =====


//posts separados para perfil de user e amigos
app.post("/api/profiles", async (req, res) => {
  const profileID = req.body.steamID;
  const profileData = await getPlayerProfiles(profileID);
  try {
    const profile = await Profile.findOneAndUpdate(
      { steamID: profileID },
      profileData,
      { new: true, upsert: true }
    );
    res.status(201).json(profile);
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});


//posts separados para perfil de user e amigos
app.post("/api/friend-profiles", async (req, res) => {
 
  try { 
    const friendProfiles = await getPlayerProfiles(req.body);
    const profiles = await Profile.insertMany(friendProfiles);
   
    res.status(201).json(profiles);
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

app.post("/api/games", async (req, res) => {
  const profileID = req.body.steamID;
  const ownedGames = await getOwnedGames(profileID);

  try {
    const games = await Game.insertMany(ownedGames);
    res.status(201).json(games);
  } catch (error) {
    console.error("Erro ao criar jogos:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// ===== STEAM LOGIN=====


const session = require('express-session');
const passport = require('passport');
//redireciona para pagina de login com a steam
const SteamStrategy = require('passport-steam').Strategy;

app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: '8CE04F099719568B5A97C3BCFCDB1C37'
}, (identifier, profile, done) => {
    return done(null, {steamID:profile.id});
}));

app.get('/auth/steam', passport.authenticate('steam'));
app.get('/auth/steam/return', 
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication
        console.log('req.user:', req.user)
        res.json({steamID: req.user.id})

    }
);

http://localhost:3000/auth/steam/return?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=id_res&openid.op_endpoint=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Flogin&openid.claimed_id=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Fid%2F76561198337493831&openid.identity=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Fid%2F76561198337493831&openid.return_to=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fsteam%2Freturn&openid.response_nonce=2025-10-28T16%3A47%3A58ZuVsQZwJ%2BBy49gipL8Fa9bkbzTQY%3D&openid.assoc_handle=1234567890&openid.signed=signed%2Cop_endpoint%2Cclaimed_id%2Cidentity%2Creturn_to%2Cresponse_nonce%2Cassoc_handle&openid.sig=Rl09Msjl1pZESve4Ok7XIEkWAm0%3D





// ===== INICIALIZAÇÃO DO SERVIDOR (também não se deve mexer)=====

app.use((req, res) => {
  return handle(req, res);
});

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await connectDB();
    await nextApp.prepare();
    app.listen(PORT, () => {
      console.log(
        `Servidor Next.js + Express a correr em http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

iniciarServidor();
