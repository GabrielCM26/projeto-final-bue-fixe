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

// ===== ENDPOINTS DA API =====

app.get("api/profiles/:steamID", async (req, res) => {
  const { steamID } = req.params;

  try {
    const profile = await Profile.findOne({ steamID });
    if (!profile) {
      return res.status(404).json({ message: "Perfil não encontrado" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

app.post("/api/profiles", async (req, res) => {
//   const profileData = req.body;

  //not sure how to do this yet (need to fetch friends from steamapi)
    const {steamID} = req.params;
    const friendIDs = await getfriendIDs(steamID);
    const friendsProfiles = await getPlayerProfiles(friendIDs);

  try {
    const profile = await Profile.findOneAndUpdate(
      { steamID: profileData.steamID },
      profileData,
      { new: true, upsert: true }
    );
    res.status(201).json(profile);
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// ===== STEAM LOGIN=====

// exemplo de implementação do login(ainda é preciso perceber como funciona)

// const session = require('express-session');
// const passport = require('passport');
// const SteamStrategy = require('passport-steam').Strategy;

// app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());

// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser((user, done) => done(null, user));

// passport.use(new SteamStrategy({
//     returnURL: 'http://localhost:3000/auth/steam/return',
//     realm: 'http://localhost:3000/',
//     apiKey: 'YOUR_STEAM_API_KEY'
// }, (identifier, profile, done) => {
//     // You can access profile.id (steamID) and displayName here
//     return done(null, profile);
// }));

// app.get('/auth/steam', passport.authenticate('steam'));
// app.get('/auth/steam/return', 
//     passport.authenticate('steam', { failureRedirect: '/' }),
//     (req, res) => {
//         // Successful authentication
//         res.redirect('/');
//     }
// );


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
