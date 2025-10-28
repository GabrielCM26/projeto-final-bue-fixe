require("dotenv").config({ path: '../.env' });
const API_KEY = process.env.STEAM_API_KEY;


async function getfriendIDs(steamID) {
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${API_KEY}&steamid=${steamID}&relationship=friend`
  );
  const data = await response.json();
  return data.friendslist
    ? data.friendslist.friends.map((friend) => friend.steamid)
    : [];
}



async function getPlayerProfiles(steamIDs) {
  const idsString = steamIDs.join(",");
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${idsString}`
  );
  const data = await response.json();
  return data.response.players;
}

module.exports = { getfriendIDs, getPlayerProfiles };
















// função de teste ******* testado, funciona *******
// (async () => {
//   try {
//     const friends = await getPlayerProfiles(['76561197986174892', '76561197988980788', '76561197990401136']); 
//     console.log(friends);
//   } catch (err) {
//     console.error("Error fetching friends:", err);
//   }
// })();

// função de teste ******* testado, funciona *******
// (async () => {
//   try {
//     const friends = await getfriendIDs("76561198067155799"); 
//     console.log(friends);
//   } catch (err) {
//     console.error("Error fetching friends:", err);
//   }
// })();
