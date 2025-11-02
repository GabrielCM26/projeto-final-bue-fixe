import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import GameCard from '../components/GameCard';

export default function AllGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // name, playtime, achievements
  const router = useRouter();

  // Get steamid from URL params or session
  const getSteamId = () => {
    // Try to get from URL params first
    if (router.query.steamid) {
      return router.query.steamid;
    }
    
    // If not in URL, you might want to get it from session/context
    // For now, we'll use a placeholder - you should replace this with your auth logic
    return '76561198337493831'; // Replace with actual steamid from your auth system
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const steamid = getSteamId();
        
        if (!steamid) {
          setError('Steam ID not found. Please log in.');
          return;
        }

        const response = await fetch(`/api/games/${steamid}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.status}`);
        }
        
        const gamesData = await response.json();
        setGames(gamesData || []);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchGames();
    }
  }, [router.isReady, router.query.steamid]);

  // Filter games based on search term
  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort games
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your games...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl mb-2">Error Loading Games</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-4">My Game Library</h1>
          <div className="text-gray-400 mb-4">
            {games.length} games in library
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedGames.map((game) => (
              <GameCard key={`${game.steamid}-${game.appid}`} game={game} />
            ))}
          </div>
        )}
      </div>

      {/* Statistics Footer */}
      {games.length > 0 && (
        <div className="bg-gray-800 mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {Math.floor(games.reduce((total, game) => total + game.playtime_forever, 0) / 60)}
                </div>
                <div className="text-gray-400">Total Hours Played</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {games.reduce((total, game) => {
                    return total + (game.achievements ? game.achievements.filter(a => a.achieved).length : 0);
                  }, 0)}
                </div>
                <div className="text-gray-400">Achievements Unlocked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {games.filter(game => game.playtime_forever > 0).length}
                </div>
                <div className="text-gray-400">Games Played</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}