import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Jura } from "next/font/google";
import { Akshar } from "next/font/google";
import { Link, ArrowRight } from "lucide-react";

const juraFont = Jura({
  subsets: ["latin"],
  weight: "400",
});

const aksharFont = Akshar({
  subsets: ["latin"],
  weight: "variable",
});

export default function UserProfile() {
  const router = useRouter();
  const { steamid } = router.query;

  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!steamid) return;

    async function loadData() {
      try {
        // Perfil
        const resProfile = await fetch(`/api/profiles/${steamid}`);
        const dataProfile = await resProfile.json();
        setProfile(dataProfile);
        console.log("PROFILE DATA", dataProfile);

        // Fetch games
        const resGames = await fetch(`/api/games/${steamid}`);
        if (!resGames.ok) throw new Error("Failed to fetch games");
        const dataGames = await resGames.json();
        setGames(dataGames);

        if (dataGames && dataGames.length > 0) {
          const allAchievements = dataGames.flatMap(
            (game) =>
              game.achievements?.map((achievement) => ({
                ...achievement,
                gameName: game.name,
                gameAppId: game.appid,
              })) || []
          );

          // Last 10 achievements
          const recent = allAchievements
            .filter(
              (achievement) => achievement.achieved && achievement.unlocktime
            )
            .sort((a, b) => new Date(b.unlocktime) - new Date(a.unlocktime))
            .slice(0, 10);

          setRecentAchievements(recent);
        }
      } catch (error) {
        console.error("Failed to load profile/games:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [steamid]);

  {
    // Página de carregamento
  }
  if (!profile) {
    return (
      <main className="min-h-screen text-white flex justify-center items-center p-4">
        <div className="text-gray-500 text-sm">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col bg-linear-to-t from-black from-75% to-[#000D12] w-screen h-screen p-5 md:px-20">
      <div className="">
        <div className="flex flex-col items-center justify-center gap-3 mb-8 md:flex-row md:justify-start">
          {/* Foto de perfil */}
          <img
            src={profile.avatar}
            alt="avatar"
            className="rounded-[10px] w-[94px] object-cover"
          />
          <div>
            {/* Nome de Utilizador */}
            <div
              className={`text-white ${aksharFont.className} font-bold text-2xl`}
            >
              {profile?.personaname || "user"}
            </div>
          </div>
        </div>

        <div>
          {/* Div que leva à página dos amigos */}
          <div
            className={` bg-neutral-800 justify-start p-2 pl-4 text-xl ${aksharFont.className} rounded-[10px] mb-5`}
          >
            <a href={`/friendsList/${steamid}`} className="flex flex-row">
              <p>
                I have{" "}
                <span className="text-[#58CE87] font-bold">
                  {profile.friends.length}
                </span>{" "}
                friends!
              </p>
              <ArrowRight className="place-self-end" />
            </a>
          </div>

          {/* Div que demonstra as 10 achievements mais recentes; */}
          <div className="flex flex-col">
            <h3 className={`${aksharFont.className} font-bold text-xl`}>
              My most recent achievements
            </h3>
            <div
              className={`bg-neutral-800 justify-start p-2 pl-4 text-xl ${aksharFont.className} rounded-[10px] flex gap-2 mb-5`}
            >
              {recentAchievements.map((ach, i) => (
                <div
                  key={`${ach.gameAppId}-${ach.apiname}`}
                  className="flex-1 bg-[#2a2c33] rounded-md p-4 flex items-center justify-center"
                >
                  <img
                    src={ach.icon}
                    alt={ach.apiname}
                    className="w-8 h-8 object-contain opacity-80"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
