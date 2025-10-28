require("dotenv").config({ path: "../.env" });
const API_KEY = process.env.STEAM_API_KEY;
console.log("API KEY:", process.env.STEAM_API_KEY);
async function getfriendIDs(steamid) {
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${API_KEY}&steamid=${steamid}&relationship=friend`
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
      steamid: player.steamid,
      avatar: player.avatarfull,
      personaname: player.personaname,
      profileurl: player.profileurl,
      timecreated: player.timecreated,
      friendsSince: friendsSince[index],
    };
  });

  return friendProfile;
}




async function getOwnedGames(steamid) {
  const response = await fetch(
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${steamid}&include_appinfo=true&include_played_free_games=true&format=json`
  );
  const data = await response.json();
  return data.response.games  || [];
}


//not sure about this one

// async function getImgIconUrl(appid, img_icon_url) {
//     const allGames= await getOwnedGames(steamid);
//     const game = allGames.find(game => game.appid === appid);
//     if (game) {
//         return `http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${img_icon_url}.jpg`;
//     }
//     throw new Error("Game not found");
// }

module.exports = { getfriendIDs, getPlayerProfiles, getOwnedGames, getImgIconUrl };

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


// (async () => {
//   try {
//     const result = await getOwnedGames("76561198067155799");
//     console.log(result);

//   } catch (err) {
//     console.error("Error fetching friends:", err);
//   }
// })();