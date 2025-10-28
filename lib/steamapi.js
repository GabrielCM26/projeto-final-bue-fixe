require("dotenv").config({ path: "../.env" });
const API_KEY = process.env.STEAM_API_KEY;

async function getfriendIDs(steamID) {
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${API_KEY}&steamid=${steamID}&relationship=friend`
  );
  const data = await response.json();
  const friendIDs = data.friendslist
    ? data.friendslist.friends.map((friend) => friend.steamid)
    : [];
  const friendsSince = data.friendslist
    ? data.friendslist.friends.map((friend) => friend.friend_since)
    : [];
  return { friendIDs, friendsSince };
}

async function getPlayerProfiles(steamID) {
  const { friendIDs, friendsSince } = await getfriendIDs(steamID);

  const idsString = friendIDs.join(",");
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${idsString}`
  );

  const data = await response.json();

  const friendProfile = data.response.players.map((player) => {
    const index = friendIDs.indexOf(player.steamid);
    return {
      steamID: player.steamid,
      avatar: player.avatarfull,
      personaname: player.personaname,
      profileurl: player.profileurl,
      timecreated: player.timecreated,
      friendsSince: friendsSince[index],
    };
  });

  return friendProfile;
}

module.exports = { getfriendIDs, getPlayerProfiles };

// função de teste ******* testado, funciona *******
// (async () => {
//   try {
//     const result = await getfriendIDs("76561198067155799");
//     console.log(result);
//     const friends = await getPlayerProfiles("76561198067155799");

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
