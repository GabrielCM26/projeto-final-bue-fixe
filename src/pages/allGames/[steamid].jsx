import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import GameCard from '@/components/GameCard';

export default function AllGames() {
    const router = useRouter();
    const { steamid } = router.query;

    const [profile, setProfile] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        if (!steamid) return;

        async function loadData() {
            try {
                // PERFIL
                const resProfile = await fetch(`/api/profiles/${steamid}`);
                const dataProfile = await resProfile.json();
                setProfile(dataProfile);
                console.log("PROFILE DATA", dataProfile);

                // Games  
                const resGames = await fetch(`/api/games/${steamid}`);
                const dataGames = await resGames.json();
                setGames(dataGames);
                console.log("GAMES DATA", dataGames);


            } catch (error) {
                console.error("Failed to load profile/games:", error);
            }
        }

        loadData();
    }, [steamid]);

    if (!profile) {
        return (
            <main className="min-h-screen text-white flex justify-center items-center p-4">
                <div className="text-gray-500 text-sm">Loading...</div>
            </main>
        );
    }

    const filteredGames = games.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedGames = [...filteredGames].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'playtime':
                return b.playtime_forever - a.playtime_forever;
            case 'achievements':
                const aAchieved = a.achievements ? a.achievements.filter(ach => ach.achieved).length : 0;
                const bAchieved = b.achievements ? b.achievements.filter(ach => ach.achieved).length : 0;
                return bAchieved - aAchieved;
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen bg-gray-600">
            {/* Header */}
            <div className="bg-gray-800 shadow-lg">
                <div className="max-w-xs md:max-w-md lg:max-w-xl xl:max-w-3xl mx-auto px-2 py-3">
                    <h1 className="text-xl font-bold text-white mb-2">Game Library</h1>
                    <div className="text-gray-400 mb-2 text-xs">{games.length} games in library</div>
                    {/* Search and Filter Controls */}
                    <div className="flex flex-row gap-2 w-full">
                        {/* Search Input */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search games..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-1 text-xs bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        {/* Sort Dropdown */}
                        <div className="flex-shrink-0 w-28">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-1 text-xs bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="playtime">Sort by Playtime</option>
                                <option value="achievements">Sort by Achievements</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>


            {/* Games Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {sortedGames.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-6xl mb-4">🎮</div>
                        <h3 className="text-white text-xl mb-2">
                            {searchTerm ? 'No games found' : 'No games in library'}
                        </h3>
                        <p className="text-gray-400">
                            {searchTerm
                                ? `Try searching for something else`
                                : 'Your game library will appear here once you sync with Steam'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="max-w-xs md:max-w-md lg:max-w-xl xl:max-w-3xl mx-auto px-2 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                            {sortedGames.map((game) => (
                                <GameCard key={`${game.steamid}-${game.appid}`} game={game} />
                            ))}
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
}
