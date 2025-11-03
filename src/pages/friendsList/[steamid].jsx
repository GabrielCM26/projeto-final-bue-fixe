import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from '@/components/Loader';

export default function FriendsList() {
    const router = useRouter();
    const { steamid } = router.query;

    const [profile, setProfile] = useState(null);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!steamid) return;

        async function fetchFriends() {
            setLoading(true);
            try {
                const resProfile = await fetch(`/api/profiles/${steamid}`);
                if (!resProfile.ok) throw new Error("Failed to fetch profile");
                const dataProfile = await resProfile.json();
                setProfile(dataProfile);

                if (dataProfile.friends && dataProfile.friends.length > 0) {
                    const friendsData = await Promise.all(
                        dataProfile.friends.map(async (friendSteamId) => {
                            try {
                                const friendResponse = await fetch(`/api/profiles/${friendSteamId}`);
                                if (!friendResponse.ok) throw new Error(`Failed to fetch friend ${friendSteamId}`);
                                const friendData = await friendResponse.json();
                                return friendData;
                            } catch (error) {
                                console.error(error);
                                return null;
                            }
                        })
                    );
                    setFriends(friendsData.filter(friend => friend !== null));
                } else {
                    setFriends([]);
                }
            } catch (error) {
                console.error("Error fetching friends:", error);
                setFriends([]);
            } finally {
                setLoading(false);
            }
        }

        fetchFriends();
    }, [steamid]);

    const filteredFriends = friends.filter(friend =>
        friend.personaname?.toLowerCase().includes(searchTerm.toLowerCase())
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
            {/* Header */}
            <section className="w-full max-w-[440px] md:max-w-[75%] bg-linear-to-t from-[#000d12] from-88% to-[#001334] rounded-2xl p-4 flex flex-col gap-6 shadow-xl">
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
                    <h1 className="text-2xl font-bold text-white mb-4">
                        Your Friends ({friends.length})
                    </h1>

                    {/* Search bar */}
                    <div className="bg-[#2B303B] rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <span>⌕</span>
                        <input
                            type="text"
                            placeholder="Search friends..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent outline-none text-gray-200 placeholder-gray-500 w-full text-sm"
                        />
                    </div>

                    {/* Friends list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredFriends.length > 0 ? (
                            filteredFriends.map((friend) => (
                                <a
                                    key={friend.steamid}
                                    href={`https://steamcommunity.com/profiles/${friend.steamid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-[#2B303B] rounded-lg p-4 flex flex-col items-center hover:bg-[#3B404B] transition-colors cursor-pointer shadow-md"
                                >
                                    <img
                                        src={friend.avatar || '/default-avatar.png'}
                                        alt={friend.personaname}
                                        className="w-24 h-24 rounded-full mb-4"
                                        onError={(e) => {
                                            e.target.src = '/default-avatar.png';
                                        }}
                                    />

                                    <p className="text-white font-semibold text-lg mb-1 text-center">
                                        {friend.personaname || 'Unknown User'}
                                    </p>

                                    <p className="text-gray-400 text-sm text-center">
                                        Friends since: {friend.friendsSince ? new Date(friend.friendsSince).toLocaleDateString() : 'Unknown'}
                                    </p>
                                </a>
                            ))
                        ) : (
                            <div className="text-gray-400 text-center py-8 col-span-full">
                                {searchTerm ? 'No friends found matching your search.' : 'No friends found.'}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
