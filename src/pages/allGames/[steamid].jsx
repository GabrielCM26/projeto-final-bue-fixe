import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import GameCard from '@/components/GameCard';
import { SortAsc, SortDesc } from 'lucide-react';


export default function AllGames() {
    const router = useRouter();
    const { steamid } = router.query;

    const [profile, setProfile] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('desc');

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

    const SortIcon = sortOrder === 'asc' ? SortAsc : SortDesc;
    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const filteredGames = games.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedGames = [...filteredGames].sort((a, b) => {
        let result;
        switch (sortBy) {
            case 'name':
                result = a.name.localeCompare(b.name);
                break;
            case 'playtime':
                result = b.playtime_forever - a.playtime_forever;
                break;
            case 'achievements':
                const aAchieved = a.achievements ? a.achievements.filter(ach => ach.achieved).length : 0;
                const bAchieved = b.achievements ? b.achievements.filter(ach => ach.achieved).length : 0;
                result = bAchieved - aAchieved;
                break;
            default:
                result = 0;
        }
        return sortOrder === 'asc' ? -result : result;
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
                                className="w-full px-3 py-2 text-xs bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        {/* Sort Dropdown */}
                        <div className="flex flex-row items-center gap-2">
                            {/* Dropdown */}
                            <div className="flex flex-row items-center gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-steam-light"
                                >
                                    <option value="name">Name (A-Z)</option>
                                    <option value="playtime">Playtime</option>
                                    <option value="achievements">Achievements</option>
                                </select>
                                {/* Sorting button*/}
                                <button
                                    onClick={toggleSortOrder}
                                    className="p-1 bg-gray-800 border border-gray-600 rounded-lg text-xs text-white font-semibold transition hover:text-steam-light"
                                    aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                                >
                                    <SortIcon className="w-5 h-5" />
                                </button>
                            </div>
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
