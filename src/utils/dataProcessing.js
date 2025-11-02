require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});
const Game = require("../models/game");
const connectDB = require("../../lib/mongodb");
const achievements = require("../models/achievements");

async function getAccountInfo(steamid) {
  const userGames = await Game.find({ steamid });
  const accountDetails = userGames.reduce((acc, data) => {
    const key = data.steamid;
    const totalPlaytime = data.playtime_forever || 0;

    const gamesNeverPlayed = data.playtime_forever === 0 ? 1 : 0;
    const gamePrice = data.price
    if (!acc[key]) {
      acc[key] = {
        steamid: data.steamid,
        totalPlaytime: 0,
        gamesNeverPlayed: 0,
        price: 0,
      };
    }
    acc[key].totalPlaytime += totalPlaytime;
    acc[key].gamesNeverPlayed += gamesNeverPlayed;

    acc[key].price += gamePrice;

    return acc;
  }, {});
  return accountDetails;
}

// const allGenreTimes = gamesWithGenres.reduce((acc, game) => {
//   game.genres.forEach(genre => {
//     const genreName = genre.description;
//     const timePlayed = game.playtime_forever || 0;
//     acc[genreName] = (acc[genreName] || 0) + timePlayed;
//   });
//   return acc;
// }, {});
// const sortedGenres = Object.entries(allGenreTimes)
//   .map(([genre, timePlayed]) => ({ genre, timePlayed }))
//   .sort((a, b) => b.timePlayed - a.timePlayed);

// return sortedGenres;

console.log(getAccountInfo("76561198006409530"));

async function getGenrePlaytime(games) {
  return games.reduce((acc, game) => {
    game.genres.forEach((genre) => {
      acc[genre] = (acc[genre] || 0) + game.playtime_forever;
    });
    return acc;
  }, {});
}

async function top10Achievements(steamid) {
  const userGames = await Game.find({ steamid });
  const topAchievements = userGames.achievements.sort((a, b) => b.unlocktime - a.unlocktime).slice(0, 10);
  return topAchievements
}


// trying for a rank friends by number of platinumed games
// async function friendsbyplat(steamid) {
//   const userProfile = await profile.find({ steamid });
//   const friends = userProfile.friends;
//   const friendsGames = friends.map(async (friendProfile) => {
//           return await Profile.find(
//             { steamid: friendProfile.steamid },
//   const gamesplated = friendsgames
// }

module.exports = { getAccountInfo, getGenrePlaytime };
// função de teste
(async () => {
  await connectDB();
  try {
    const friends = await getAccountInfo("76561198067155799");
    console.log(friends);
  } catch (err) {
    console.error("Error fetching friends:", err);
  }
})();
