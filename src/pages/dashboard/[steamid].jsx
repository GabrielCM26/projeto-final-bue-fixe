import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import CardDashboard from "../../components/CardDasboard.jsx";

export default function Dashboard() {
  const router = useRouter();
  const { steamid } = router.query;

  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [bestGame, setBestGame] = useState(null);

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

        // Total horas jogadas (somatório em minutos -> horas arredondadas)
        const totalMinutes = dataGames.reduce(
          (acc, game) => acc + (game.playtime_forever || 0),
          0
        );
        setTotalHours(Math.round(totalMinutes / 60));

        // BEST GAME (mais jogado)
        if (dataGames.length > 0) {
          const mostPlayed = [...dataGames].sort(
            (a, b) =>
              (b.playtime_forever || 0) - (a.playtime_forever || 0)
          )[0];

          // horas jogadas desse jogo
          const hoursPlayed = Math.round(
            (mostPlayed.playtime_forever || 0) / 60
          );

          // última vez jogado (Steam dá epoch em segundos)
          let lastPlayedLabel = "—";
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
              lastPlayedLabel = `${diffDays} dias atrás`;
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
        className="
          w-full
          max-w-sm
          sm:max-w-md
          md:max-w-2xl
          lg:max-w-4xl
          xl:max-w-5xl
          bg-[#1E1E1E]
          rounded-2xl
          p-4
          md:p-6
          flex
          flex-col
          gap-6
          shadow-xl
          shadow-black/40
        "
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
                <div className="text-[10px] text-center leading-[1.75rem] text-gray-200">
                  ?
                </div>
              )}
            </div>
          </div>
        </header>

        <CardDashboard bestGame={bestGame} />

        {/* RESTO DO DASHBOARD */}
        <div className="flex flex-col gap-7">
          
          <div className="flex flex-col sm:flex-row gap-2 text-center">
            {/* HOURS PLAYED */}
            <div className="flex-1 bg-[#282828] rounded-md p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
              <div className="text-white font-semibold text-lg">
                {totalHours}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                Hours played
              </div>
            </div>

            {/* GAMES OWNED */}
            <div className="flex-1 bg-[#282828] rounded-md p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
              <div className="text-white font-semibold text-lg">
                {games.length}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                Games owned
              </div>
            </div>
          </div>

          {/* Suggested Games / Money Wasted */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#282828] rounded-md py-3 px-2 text-xs text-gray-300 hover:bg-gray-700 transition">
              <img
                src="/ListaIcon1.png"
                alt="list icon"
                className="w-9 h-9 opacity-80"
              />
              <span className="text-left leading-tight">
                Suggested <br /> Games
              </span>
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 bg-[#282828] rounded-md py-3 px-2 text-xs text-gray-300 hover:bg-gray-700 transition">
              <img
                src="/money.png"
                alt="money icon"
                className="w-9 h-9 opacity-80"
              />
              <span className="text-left leading-tight">
                Money
                <br /> Wasted
              </span>
            </button>
          </div>

        

          {/* BEST ACHIEVEMENTS */}
          <div className="bg-[#282828] rounded-md p-3 flex flex-col gap-4 transition-all duration-300 hover:shadow-lg">
            <div className="text-xs text-gray-200 font-medium">
              Best achievements
            </div>

            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-center text-center text-[11px] text-gray-300"
                >
                  <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center overflow-hidden mb-2">
                    <img
                      src="/trophy-placeholder.png"
                      alt={`Trophy ${i}`}
                      className="w-8 h-8 object-contain opacity-80"
                    />
                  </div>
                  <div className="leading-tight">Tron</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Debug / info */}
        <div className="text-[10px] text-gray-500 pt-2">
          steamid atual: {steamid || "(sem steamid )"}
        </div>
      </section>
    </main>
  );
}