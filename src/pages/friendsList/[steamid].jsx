import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from '@/components/Loader';

export default function FriendsList() {
    const router = useRouter();
    const { steamid } = router.query;
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (steamid) {
            fetchFriends();
        }
    }, [steamid]);

    const fetchFriends = async () => {
        try {
            setLoading(true);

            // Get the main user's profile to access friends array
            const userResponse = await fetch(`/api/profiles/${steamid}`);
            const userData = await userResponse.json();

            if (userData.friends && userData.friends.length > 0) {
                // Fetch each friend's profile data
                const friendsData = await Promise.all(
                    userData.friends.map(async (friendSteamId) => {
                        try {
                            const friendResponse = await fetch(`/api/profiles/${friendSteamId}`);
                            const friendData = await friendResponse.json();
                            return friendData;
                        } catch (error) {
                            console.error(`Error fetching friend ${friendSteamId}:`, error);
                            return null;
                        }
                    })
                );

                // Filter out any failed requests and set friends data
                setFriends(friendsData.filter(friend => friend !== null));
            }
        } catch (error) {
            console.error("Error fetching friends:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter friends based on search term
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
        <main className="p-4">

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
        </main>
    );
}
