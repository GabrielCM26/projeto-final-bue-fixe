import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Jura } from "next/font/google";
import { Akshar } from "next/font/google";

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
    // const [totalHours, setTotalHours] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [searchTerm, setSearchTerm] = useState('');
    // const [sortBy, setSortBy] = useState('name');
    // const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        if (!steamid) return;

        async function loadData() {
            try {

                // PERFIL
                const resProfile = await fetch(`/api/profiles/${steamid}`);
                const dataProfile = await resProfile.json();
                setProfile(dataProfile);
                console.log("PROFILE DATA", dataProfile);

                // Fetch games
                const resGames = await fetch(`/api/games/${steamid}`);
                if (!resGames.ok) throw new Error("Failed to fetch games");
                const dataGames = await resGames.json();
                setGames(dataGames);
            } catch (error) {
                console.error("Failed to load profile/games:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [steamid]);

    {/* Página de carregamento */}
    if (!profile) {
        return (
            <main className="min-h-screen text-white flex justify-center items-center p-4">
                <div className="text-gray-500 text-sm">Loading...</div>
            </main>
        );
    }


    return (
        <main className="flex flex-col bg-linear-to-t from-black from-75% to-[#000D12] w-screen h-screen">
            <div className="flex ">

                {/* Foto de perfil */}
                <img
                    src={profile.avatar}
                    alt="avatar"
                    className="rounded-[10px] w-[94px] object-cover"
                />
                <div>

                    {/* Nome de Utilizador */}
                    <h1>
                        <div className="text-sm text-gray-200 truncate max-w-24">
                            {profile?.personaname || "user"}
                        </div>
                    </h1>
                    <div>

                        {/* "Roles" com Genres */}
                        {/* {game.genres && game.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {game.genres.slice(0, 3).map((genre, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-700 text-[10px] rounded-full text-gray-300">
                                    {genre.description}
                                </span>
                                ))}
                                {game.genres.length > 3 && (
                                <span className="px-2 py-1 bg-gray-700 text-[10px] rounded-full text-gray-300">
                                    +{game.genres.length - 3}
                                </span>
                                )}
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
            {/* Div que demonstra as 10 achievements mais recentes (opcional); leva depois à página dos achievements todos */}
            <div>
                <h3>My most recent achievements</h3>
                <div className="flex gap-2">
                    {game.achievements.map((i) => (
                        <div
                            key={i}
                            className="flex-1 bg-[#2a2c33] rounded-md p-4 flex items-center justify-center"
                        >
                            <img
                                src="game.achievements.icon"
                                alt={`Trophy ${i}`}
                                className="w-8 h-8 object-contain opacity-80"
                            />
                        </div>
                    ))}
                </div>
                <a href="/allAchievements">view all...</a>
            </div>

            {/* Fake div que leva à página dos amigos */}
            <button>
                <p>I have {profile.friends.length} friends!</p>
            </button>

            {/* Div com botão e flavor text */}
            <div>
                <p>Who has the most games platinumed? Click here to check!</p>
                <button>
                    <p>Leaderboard</p>
                    <div className="flex justify-between">
                        {(Array.isArray(profile.friends) ? profile.friends.slice(0, 5) : []).map(
                            (friend, i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center overflow-hidden"
                                    title={friend.personaname || "Friend"}
                                >
                                    {friend.avatar ? (
                                        <img
                                            src={friend.avatar}
                                            alt={friend.personaname || "Friend avatar"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-[10px] text-gray-300 px-1 text-center leading-tight">
                                            {friend.personaname || "Friend"}
                                        </span>
                                    )}
                                </div>
                            )
                        )}
                    </div>
                </button>
            </div>
        </main>
    )
};