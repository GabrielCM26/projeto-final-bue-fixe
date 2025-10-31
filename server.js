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
const Genre = require("./src/models/genre");
const {
  getPlayerProfiles,
  getOwnedGames,
  checkAchievements,
  getfriendIDs,
  getGameGenres,
  getGamePrice
} = require("./lib/steamapi");
const mongoose = require("mongoose");

// ===== ENDPOINTS DA API =====

// ===== GET =====

app.get("/api/profiles/:steamid", async (req, res) => {
  const { steamid } = req.params;

  try {
    const profile = await Profile.findOne({ steamid }).populate("friends");
    if (!profile) {
      return res.status(404).json({ message: "Perfil não encontrado" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

app.get("/api/games/:steamid", async (req, res) => {
  const { steamid } = req.params;

  try {
    const games = await Game.findMany({ steamid });
    res.json(games);
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// ===== POST =====

app.post("/api/profiles", async (req, res) => {
  const profileID = req.body.steamid;

  try {
    const { userProfile, friendsProfiles } = await getPlayerProfiles(profileID);

    friendDocs = await Promise.all(
      friendsProfiles.map(async (friendProfile) => {
        return await Profile.findOneAndUpdate(
          { steamid: friendProfile.steamid },
          { $set: friendProfile },
          { new: true, upsert: true }
        );
      })
    );

    userProfile.friends = friendDocs.map((doc) => doc._id);

    const profile = await Profile.findOneAndUpdate(
      { steamid: profileID },
      { $set: userProfile },
      { new: true, upsert: true }
    );
    res.status(201).json({ userProfile: profile, friendProfiles: friendDocs });
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

app.post("/api/games", async (req, res) => {
  const profileID = req.body.steamid;

  try {
    const ownedGames = await getOwnedGames(profileID);
    const friendsSteamIDs  = await getfriendIDs(profileID);
    console.log("OwnedGames:", ownedGames);
    console.log("FriendsSteamIDs:", friendsSteamIDs);

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    

    // const friendGamesWithAchievements = await Promise.all(
    //   friendsSteamIDs.friendIDs.map(async (friend) => {
    //     const friendGames = await getOwnedGames(friend);
    //     if (friendGames.length === 0) {
    //       return [];
    //     }
    //     // console.log("friendGames:", friendGames);
    //     const gamesWithAchievements = await Promise.all(
    //       friendGames.map(async (game) => {
    //         const achievements = await checkAchievements(friend, game.appid);
    //         const mappedAchievements = (achievements || []).map((a) => ({
    //           apiname: a.apiname,
    //           achieved: !!a.achieved,
    //           unlocktime: a.unlocktime,
    //         }));

    //         return {
    //           steamid: friend,
    //           appid: game.appid,
    //           name: game.name,
    //           img_icon_url: game.img_icon_url,
    //           playtime_forever: game.playtime_forever,
    //           achievements: mappedAchievements,
    //         };
    //       })
    //     );

    //     return gamesWithAchievements;
    //   })
    // );

    const gamesWithAchievements = await Promise.all(
      ownedGames.map(async (game) => {
        const genres = await getGameGenres(game.appid);
        const price = await getGamePrice(game.appid);
        const priceValue = (typeof price === 'number' && !isNaN(price)) ? price : 0;
        const achievements = await checkAchievements(profileID, game.appid);
        //  console.log(achievements);
        // console.log("Game:", game.name, "Genres:", genres, "Price:", price);
        const mappedGenres = genres.map(g => ({ id: g.id, description: g.description }));
        console.log(mappedGenres);
        const mappedAchievements = (achievements || []).map((a) => ({
          apiname: a.apiname,
          achieved: !!a.achieved,
          unlocktime: a.unlocktime,
        }));

        return {
          steamid: profileID,
          appid: game.appid,
          name: game.name,
          img_icon_url: game.img_icon_url,
          playtime_forever: game.playtime_forever,
          achievements: mappedAchievements,
          genres: mappedGenres,
          price: priceValue
        };
      })
    );

    const games = await Promise.all(
      gamesWithAchievements.map(async (game) => {
        return await Game.findOneAndUpdate(
          { steamid: game.steamid, appid: game.appid },
          { $set: game },
          { new: true, upsert: true }
        );
      })
    );
//  const flattenedFriendGames = friendGamesWithAchievements.flat();
//     const friendGames = await Promise.all(
//       flattenedFriendGames.map(async (game) => {
//         return await Game.findOneAndUpdate(
//           { steamid: game.steamid, appid: game.appid },
//           { $set: game },
//           { new: true, upsert: true }
//         );
//       })
//     );

    res.status(201).json(games);
  } catch (error) {
    console.error("Erro ao criar jogos:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// ===== STEAM LOGIN=====

const session = require("express-session");
const passport = require("passport");
//redireciona para pagina de login com a steam
const SteamStrategy = require("passport-steam").Strategy;

app.use(
  session({ secret: "your-secret", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:3000/auth/steam/return",
      realm: "http://localhost:3000/",
      apiKey: "8CE04F099719568B5A97C3BCFCDB1C37",
    },
    (identifier, profile, done) => {
      return done(null, { steamid: profile.id });
    }
  )
);

app.get("/auth/steam", passport.authenticate("steam"));
app.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication
    console.log("req.user:", req.user);
    res.json({ steamid: req.user.steamid });
  }
);

//localhost:3000/auth/steam/return?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=id_res&openid.op_endpoint=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Flogin&openid.claimed_id=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Fid%2F76561198337493831&openid.identity=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Fid%2F76561198337493831&openid.return_to=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fsteam%2Freturn&openid.response_nonce=2025-10-28T16%3A47%3A58ZuVsQZwJ%2BBy49gipL8Fa9bkbzTQY%3D&openid.assoc_handle=1234567890&openid.signed=signed%2Cop_endpoint%2Cclaimed_id%2Cidentity%2Creturn_to%2Cresponse_nonce%2Cassoc_handle&openid.sig=Rl09Msjl1pZESve4Ok7XIEkWAm0%3D

// ===== INICIALIZAÇÃO DO SERVIDOR (também não se deve mexer)=====

http: app.use((req, res) => {
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
