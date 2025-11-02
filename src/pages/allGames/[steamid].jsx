import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import GameCard from '@/components/GameCard';
import Loader from '@/components/Loader';
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
            setLoading(true);
            setError(null)
            try {
                // Fetch profile
                const resProfile = await fetch(`/api/profiles/${steamid}`);
                if (!resProfile.ok) throw new Error("Failed to fetch profile");
                const dataProfile = await resProfile.json();
                setProfile(dataProfile);

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

    if (loading) {
        return (
            <main className="min-h-screen flex justify-center items-center bg-gray-900 p-4">
                <Loader />
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
        <main className="min-h-screen text-white flex justify-center items-center p-4">
            {/* Header */}
            <section className="w-full max-w-[440px] md:max-w-[75%] bg-linear-to-t from-[#000d12] from-50% to-[#001334] rounded-2xl p-4 flex flex-col gap-6 shadow-xl">
                <header className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <img
                            src="/Logo.png"
                            alt="PlayDex logo"
                            className="w-25 h-6 object-contain"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-200 truncate max-w-24">
                            {profile?.personaname || "user"}
                        </div>

                        <div className="w-6 h-6 rounded-full bg-gray-500 overflow-hidden">
                            {profile?.avatar && (
                                <a href="../userprofile/[steamid]">
                                    <img
                                        src={profile.avatar}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </a>
                            )}
                        </div>
                    </div>

                </header>
                <title className="w-full max-w-[440px] md:max-w-[75%] bg-[#1a1c20] rounded-2xl p-4 flex flex-col gap-6 shadow-xl">
                    <h1 className="text-xl font-bold text-white mb-2">Game Library</h1>
                    <div className="text-gray-400 mb-2 text-xs">{games.length} games in library</div>
                </title>
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
                        <div className="max-w-[440px] md:max-w-full x-auto px-2 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                                {sortedGames.map((game) => (
                                    <GameCard key={`${game.steamid}-${game.appid}`} game={game} />
                                ))}
                            </div>
                        </div>

                    )}
                </div>
            </section >
        </main >
    );
}
