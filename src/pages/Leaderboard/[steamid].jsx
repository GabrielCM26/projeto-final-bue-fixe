import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from '@/components/Loader';
import { Medal } from 'lucide-react';

export default function Leaderboard() {
    const router = useRouter();
    const { steamid } = router.query;

    const [profile, setProfile] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!steamid) return;

        async function fetchLeaderboardData() {
            setLoading(true);
            try {
                // Fetch user profile
                const resProfile = await fetch(`/api/profiles/${steamid}`);
                if (!resProfile.ok) throw new Error("Failed to fetch profile");
                const dataProfile = await resProfile.json();
                setProfile(dataProfile);

                
                const allUserIds = [steamid, ...(dataProfile.friends || [])];
                
                // Fetch data for all users
                const allUsersData = await Promise.all(
                    allUserIds.map(async () => {
                        try {
                            // Fetch profile
                            const profileResponse = await fetch(`/api/profiles/${steamid}`);
                            if (!profileResponse.ok) throw new Error(`Failed to fetch profile ${steamid}`);
                            const profileData = await profileResponse.json();

                            // Fetch games
                            const gamesResponse = await fetch(`/api/games/${steamid}`);
                            if (!gamesResponse.ok) {
                                
                                return {
                                    steamid: steamid,
                                    personaname: profileData.personaname || "Unknown User",
                                    avatar: profileData.avatar || "/default-avatar.png",
                                    moneyWasted: 0,
                                    isCurrentUser: steamid === steamid,
                                    hasGameData: false
                                };
                            }
                            
                            const gamesData = await gamesResponse.json();

                            // Calculate money wasted
                            const games = Array.isArray(gamesData) ? gamesData : [];
                            const moneyWasted = games
                                .filter(game => game.playtime_forever === 0 && game.price > 0)
                                .reduce((total, game) => total + (game.price || 0), 0);
                            
                            return {
                                steamid: steamid,
                                personaname: profileData.personaname || "Unknown User",
                                avatar: profileData.avatar || "/default-avatar.png",
                                moneyWasted: moneyWasted / 100, // Convert from cents to euros
                                isCurrentUser: steamid === steamid,
                                hasGameData: true
                            };
                        } catch (error) {

                            return null;
                        }
                    })
                );

                
                const validData = allUsersData
                    .filter(user => user !== null)
                    .sort((a, b) => b.moneyWasted - a.moneyWasted);

                setLeaderboardData(validData);
            } catch (error) {
                console.error("Error fetching leaderboard data:", error);
                setLeaderboardData([]);
            } finally {
                setLoading(false);
            }
        }

        fetchLeaderboardData();
    }, [steamid]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Medal color="#f5d356" />;
            case 1: return <Medal color="#e5e3dc" />;
            case 2: return <Medal color="#bf975f" />;
            default: return `#${index + 1}`;
        }
    };

    const handleCardClick = (steamId) => {
        window.open(`https://steamcommunity.com/profiles/${steamId}`, '_blank', 'noopener,noreferrer');
    };

    const filteredLeaderboard = leaderboardData.filter(user =>
        user.personaname?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <main className="min-h-screen flex justify-center items-center bg-gray-900 p-4">
                <Loader />
            </main>
        );
    }

    return (
        <main className="min-h-screen text-white flex justify-center items-center p-4">
            <section className="w-full max-w-[440px] md:max-w-[75%] bg-linear-to-t from-[#000d12] from-88% to-[#001334] rounded-2xl p-4 flex flex-col gap-6 shadow-xl">
                {/* Header */}
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
                                <a href={`../userprofile/${steamid}`}>
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

                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Money Wasted Leaderboard
                    </h1>
                    <p className="text-gray-400 text-sm mb-4">
                        Ranking based on money spent on unplayed games
                    </p>

                    {/* Search bar */}
                    <div className="bg-[#2B303B] rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <span>⌕</span>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent outline-none text-gray-200 placeholder-gray-500 w-full text-sm"
                        />
                    </div>

                    {/* Leaderboard List */}
                    <div className="space-y-3">
                        {filteredLeaderboard.length > 0 ? (
                            filteredLeaderboard.map((user, index) => (
                                <div
                                    key={user.steamid}
                                    onClick={() => handleCardClick(user.steamid)}
                                    className={`rounded-lg p-4 flex items-center hover:bg-opacity-80 hover:scale-[1.02] transition-all duration-300 cursor-pointer shadow-md ${
                                        user.isCurrentUser 
                                            ? 'bg-[#aae4c1]/20 border-2 border-[#aae4c1]' 
                                            : 'bg-[#2B303B] hover:bg-[#3B404B]'
                                    }`}
                                >
                                    {/* Rank */}
                                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold mr-4 border-2 border-gray-600">
                                        {getRankIcon(index)}
                                    </div>

                                    {/* Avatar */}
                                    <img
                                        src={user.avatar}
                                        alt={user.personaname}
                                        className="w-12 h-12 rounded-full mr-4 border-2 border-gray-600"
                                        onError={(e) => {
                                            e.target.src = '/default-avatar.png';
                                        }}
                                    />

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-white font-semibold text-lg truncate">
                                                {user.personaname}
                                            </p>
                                            {user.isCurrentUser && (
                                                <span className="bg-[#aae4c1] text-black text-xs font-bold px-2 py-1 rounded-full">
                                                    YOU
                                                </span>
                                            )}
                                        </div>
                                        {!user.hasGameData && (
                                            <p className="text-red-400 text-xs mt-1">
                                                No game data available
                                            </p>
                                        )}
                                    </div>

                                    {/* Money Wasted */}
                                    <div className="text-right ml-4">
                                        <p className={`font-bold text-xl ${user.hasGameData ? 'text-red-400' : 'text-gray-500'}`}>
                                            {formatCurrency(user.moneyWasted)}
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            {user.hasGameData ? 'Wasted' : 'No Data'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400 text-center py-8">
                                {searchTerm ? 'No users found matching your search.' : 'No leaderboard data available.'}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
