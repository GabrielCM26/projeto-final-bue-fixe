
const { get } = require("mongoose");

require("dotenv").config({ path: "../.env" });
const API_KEY = process.env.STEAM_API_KEY;


async function getPlayerSummaries(steamids) {
  const idsString = steamids.join(",");
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${idsString}`
  );
  const data = await response.json();
  return data.response.players || [];
};

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
const userArr = await getPlayerSummaries([steamID]);

const user = userArr[0];
const userProfile = {
  steamid: user.steamid,
  avatar: user.avatarfull,
  personaname: user.personaname,
  profileurl: user.profileurl,
  timecreated: user.timecreated ? new Date(user.timecreated * 1000) : null,
  loccountrycode: user.loccountrycode,

}


let friendsProfiles = []
if (friendIDs.length > 0) {
  friendsArr = await getPlayerSummaries(friendIDs);
   friendsProfiles = friendsArr.map((profile, i) => ({
     steamid: profile.steamid,
     avatar: profile.avatarfull,
     personaname: profile.personaname,
     profileurl: profile.profileurl,
     timecreated: profile.timecreated ? new Date(profile.timecreated * 1000) : null,
     loccountrycode: profile.loccountrycode,
     friendsSince: friendsSince[i] ? new Date(friendsSince[i] * 1000) : null
   }));




  }
  return { friendsProfiles, userProfile };
}

async function getGamePrice(appid) {
    const response = await fetch(
        `https://store.steampowered.com/api/appdetails?appids=${appid}&l=portuguese`
    );
     if (response.status !== 200) {
      return [];
    }
    const data = await response.json();
    return data[appid]?.data?.price_overview?.final ? data[appid].data.price_overview.final : null;
}

async function getGameGenres(appid) {
  
    const response = await fetch(
        `https://store.steampowered.com/api/appdetails?appids=${appid}&l=portuguese`
    );
    if (response.status !== 200) {
      return [];
    }
    const data = await response.json();
    return data[appid]?.data?.genres || [];
}

async function getOwnedGames(steamid) {
  if (typeof steamid !== 'string') {
    console.log("Invalid steamid:", steamid);
  }
  console.log("Fetching games for steamid:", steamid);

const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${steamid}&include_appinfo=true&format=json`;
  const response = await fetch(url); 
  if (response === null || response.status !== 200) {
      return [];
    }
  console.log("Steam API status:", response.status, "URL:", url);
  const data = await response.json();
  return data.response.games  || [];
}


async function getGameAchievements( appid) {
    const response = await fetch(
        `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0002/?appid=${appid}&key=${API_KEY}`
    );
    const data = await response.json();
     return data?.game?.availableGameStats?.achievements ?? [];
}



async function getAchievements(steamid, appid) {
    const response = await fetch(
        `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appid}&key=${API_KEY}&steamid=${steamid}`
    );
    const data = await response.json();
    return data.playerstats.achievements || [];
 
   
}

async function checkAchievements(steamid, appid) {


const achievements = await getGameAchievements(appid);
const playerAchievements = await getAchievements(steamid, appid);

  // console.log(achievements);
  // console.log(playerAchievements);

  const achievementStatus = achievements.map((ach) => {
    const playerAch = playerAchievements.find((pa) => pa.apiname === ach.name);
    return {
      apiname: ach.name,
      achieved: playerAch ? !!playerAch.achieved : false,
      unlocktime: playerAch && playerAch.unlocktime ? new Date(playerAch.unlocktime*1000) : null,
    };
  });
  // console.log(achievementStatus);
  return achievementStatus;
}

// async function getImgIconUrl(appid, img_icon_url) {
//     const allGames= await getOwnedGames(steamid);
//     const game = allGames.find(game => game.appid === appid);
//     if (game) {
//         return `http://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${img_icon_url}.jpg`;
//     }
//     throw new Error("Game not found");
// }

module.exports = { getfriendIDs, getPlayerProfiles, getOwnedGames, checkAchievements, getGamePrice, getGameGenres };

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