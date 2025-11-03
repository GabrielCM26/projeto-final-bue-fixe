import { useRouter } from "next/router";
import { useState, useEffect, useMemo } from "react";
import CardDashboard from "../../components/CardDasboard.jsx";

export default function Dashboard() {
  const router = useRouter();
  const { steamid } = router.query;

  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [bestGame, setBestGame] = useState(null);
  const [friendsMoney, setFriendsMoney] = useState([]);
  const [loadingFriendsMoney, setLoadingFriendsMoney] = useState(false);

  // Dinheiro em euros
  const formatCurrency = (amountInt) => {
    if (typeof amountInt !== "number") return "-";
    const amount = amountInt / 100;
    try {
      return amount.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });
    } catch (e) {
      return `â‚¬${amount.toFixed(2)}`;
    }
  };

  useEffect(() => {
    if (!steamid) return;

    async function loadData() {
      try {
        // PERFIL
        const resProfile = await fetch(`/api/profiles/${steamid}`);
        const dataProfile = await resProfile.json();

        const normalizedProfile = dataProfile.userProfile
          ? {
              ...dataProfile.userProfile,
              friends: dataProfile.friendsProfiles || [],
              steamLevel: dataProfile.steamLevel ?? null,
            }
          : dataProfile;

        setProfile(normalizedProfile);

        // GAMES
        const resGames = await fetch(`/api/games/${steamid}`);
        const dataGames = await resGames.json();
        setGames(dataGames);

        // Total horas jogadas (somatÃ³rio em minutos -> horas arredondadas)
        const totalMinutes = dataGames.reduce(
          (acc, game) => acc + (game.playtime_forever || 0),
          0
        );
        setTotalHours(Math.round(totalMinutes / 60));

        // BEST GAME (mais jogado)
        if (dataGames.length > 0) {
          const mostPlayed = [...dataGames].sort(
            (a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0)
          )[0];

          // horas jogadas desse jogo
          const hoursPlayed = Math.round(
            (mostPlayed.playtime_forever || 0) / 60
          );

          let lastPlayedLabel = "-";
          if (mostPlayed.rtime_last_played) {
            const last = new Date(mostPlayed.rtime_last_played * 1000);
            const diffDays = Math.floor(
              (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (diffDays === 0) {
              lastPlayedLabel = "Hoje";
            } else if (diffDays === 1) {
              lastPlayedLabel = "Ontem";
            } else {
              lastPlayedLabel = `${diffDays} dias atrÃ¡s`;
            }
          }

          const coverUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${mostPlayed.appid}/library_600x900.jpg`;

          const achievementsDone = mostPlayed.achievementsDone || 0;
          const achievementsTotal = mostPlayed.achievementsTotal || 0;

          setBestGame({
            appid: mostPlayed.appid,
            name: mostPlayed.name,
            developer: mostPlayed.developer || "",
            quote: "",
            cover: coverUrl,
            hoursPlayed,
            achievementsDone,
            achievementsTotal,
            lastPlayed: lastPlayedLabel,
          });
        } else {
          setBestGame(null);
        }
      } catch (error) {
        console.error("Failed to load profile/games:", error);
      }
    }

    loadData();
  }, [steamid]);

  // Carregar "money wasted" dos amigos e link para Steam
  useEffect(() => {
    if (!profile || !Array.isArray(profile.friends) || profile.friends.length === 0) {
      setFriendsMoney([]);
      return;
    }

    let aborted = false;
    async function loadFriendsMoney() {
      try {
        setLoadingFriendsMoney(true);
        const friendIds = profile.friends.slice(0, 25);
        const results = await Promise.all(
          friendIds.map(async (fid) => {
            try {
              const [resProf, resGames] = await Promise.all([
                fetch(`/api/profiles/${fid}`),
                fetch(`/api/games/${fid}`),
              ]);

              const friendProfile = resProf.ok ? await resProf.json() : null;
              const friendGames = resGames.ok ? await resGames.json() : [];

              const money = (friendGames || []).reduce(
                (sum, g) => sum + (g.price || 0),
                0
              );

              return {
                steamid: fid,
                personaname: friendProfile?.personaname || fid,
                avatar: friendProfile?.avatar || null,
                moneyWasted: money,
              };
            } catch (e) {
              return null;
            }
          })
        );

        if (!aborted) {
          const ordered = results
            .filter(Boolean)
            .sort((a, b) => (b.moneyWasted || 0) - (a.moneyWasted || 0));
          setFriendsMoney(ordered);
        }
      } finally {
        if (!aborted) setLoadingFriendsMoney(false);
      }
    }

    loadFriendsMoney();
    return () => {
      aborted = true;
    };
  }, [profile]);

  // Total de money wasted do utilizador (soma dos preÃ§os)
  const userMoneyWasted = useMemo(() => {
    if (!games || games.length === 0) return 0;
    return games.reduce((sum, g) => sum + (g.price || 0), 0);
  }, [games]);

  // LOADING STATE
  if (!profile) {
    return (
      <main className="min-h-screen text-white flex justify-center items-center p-4 bg-[#121212]">
        <div className="text-gray-500 text-sm">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white flex justify-center p-6 md:p-9 bg-[#121212]">
      <section
        className="w-full max-w-[440px] md:max-w-[75%] bg-linear-to-t from-[#000d12] from-88% to-[#001334] rounded-2xl p-4 flex flex-col gap-6 shadow-xl"
      >
        {/* HEADER */}
        <header className="grid grid-cols-3 items-center">
          <div></div>

          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="/Logo.png"
              alt="PlayDex logo"
              className="h-8 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-2 justify-end">
            <div className="text-sm text-gray-200 truncate max-w-24">
              {profile?.personaname || "user"}
            </div>

            <div className="w-7 h-7 rounded-full bg-gray-500 overflow-hidden ring-1 ring-black/30 shrink-0">
              {profile?.avatar ? (
                <a href={`/userprofile/${steamid}`}>
                  <img
                    src={profile.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </a>
              ) : (
                <div className="text-[10px] text-center leading-[1.75rem] text-gray-200">?</div>
              )}
            </div>
          </div>
        </header>

        <CardDashboard bestGame={bestGame} />

        {/* RESTO DO DASHBOARD */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row gap-2 text-center">
            {/* HOURS PLAYED */}
            <div className="flex-1 bg-[#282828] rounded-md p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
              <div className="text-white font-semibold text-lg">{totalHours}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">Hours played</div>
            </div>

            {/* MONEY WASTED (total) */}
            <div className="flex-1 bg-[#282828] rounded-md p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
              <div className="text-white font-semibold text-lg">{formatCurrency(userMoneyWasted)}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">Money wasted</div>
            </div>

            {/* GAMES OWNED */}
            <div className="flex-1 bg-[#282828] rounded-md p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
              <div className="text-white font-semibold text-lg">{games.length}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">Games owned</div>
            </div>
          </div>

          {/* Friends' Money Wasted */}
          <div className="bg-[#1a1a1a] rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-white">Money Wasted dos Amigos</div>
              <a href={`/leaderboard/${steamid}`} className="text-[10px] text-gray-400 hover:text-[#aae4c1]">See all</a>
            </div>
            {loadingFriendsMoney ? (
              <div className="text-xs text-gray-400">A carregar...</div>
            ) : friendsMoney.length === 0 ? (
              <div className="text-xs text-gray-400">Sem dados dos amigos.</div>
            ) : (
              <ul className="flex flex-col gap-2">
                {friendsMoney.slice(0, 5).map((f, idx) => (
                  <li key={f.steamid} className="flex items-center gap-2 bg-[#282828] rounded-md p-2">
                    <div className="text-xs text-gray-400 w-5 text-center">{idx + 1}</div>
                    <a
                      href={`https://steamcommunity.com/profiles/${f.steamid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 flex-1 min-w-0"
                    >
                      <div className="w-8 h-8 bg-gray-700 rounded overflow-hidden shrink-0">
                        {f.avatar ? (
                          <img src={f.avatar} alt={f.personaname} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{f.personaname}</div>
                        <div className="text-[10px] text-gray-400 truncate">{f.steamid}</div>
                      </div>
                    </a>
                    <div className="text-sm font-semibold text-red-400 whitespace-nowrap">{formatCurrency(f.moneyWasted)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Debug / info */}
        <div className="text-[10px] text-gray-500 pt-2">steamid atual: {steamid || "(sem steamid )"}</div>
      </section>
    </main>
  );
}
