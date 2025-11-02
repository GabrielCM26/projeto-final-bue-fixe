import React, { useState } from "react";

const GameCard = ({ game }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const threshold = 12;

  const handleMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ x: y * -threshold, y: x * threshold });
  };

  const handleLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Format playtime hours
  const formatPlaytime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    return `${hours.toFixed(1)} Hours Played`;
  };

  // Calculate achievement progress
  const achievementProgress = game.achievements ? 
    `${game.achievements.filter(a => a.achieved).length} / ${game.achievements.length}` : 
    '0 / 0';

  return (
    <div
      className="rounded-xl shadow-xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer w-80 bg-gradient-to-b from-gray-700 to-gray-900 relative"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
      }}
    >
      {/* Game poster/header image */}
      <div className="relative h-36 bg-gradient-to-r from-blue-400 to-purple-600">
        {game.poster ? (
          <img
            src={game.poster}
            alt={game.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-lg font-bold">{game.name}</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
      </div>

      {/* Game info section */}
      <div className="p-4 text-white">
        {/* Game title */}
        <h3 className="text-lg font-semibold text-blue-300 mb-2 truncate">
          {game.name}
        </h3>

        {/* Playtime */}
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 mr-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-400">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
            </svg>
          </div>
          <span className="text-sm text-gray-300">
            {formatPlaytime(game.playtime_forever)}
          </span>
        </div>

        {/* Achievements */}
        <div className="flex items-center mb-3">
          <div className="w-4 h-4 mr-2">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-yellow-500">
              <path d="M5,16L3,5L8.5,12L12,5L15.5,12L21,5L19,16H5M12,18A2,2 0 0,1 14,20A2,2 0 0,1 12,22A2,2 0 0,1 10,20A2,2 0 0,1 12,18Z" />
            </svg>
          </div>
          <span className="text-sm text-gray-300">Achievements</span>
          <span className="ml-auto text-sm font-semibold text-yellow-400">
            {achievementProgress}
          </span>
        </div>

        {/* Achievement progress bar */}
        {game.achievements && game.achievements.length > 0 && (
          <div className="w-full bg-gray-600 rounded-full h-2 mb-3">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(game.achievements.filter(a => a.achieved).length / game.achievements.length) * 100}%`
              }}
            ></div>
          </div>
        )}

        {/* Genres */}
        {game.genres && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {game.genres.slice(0, 3).map((genre, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-600 text-xs rounded-full text-gray-300"
              >
                {genre.description}
              </span>
            ))}
            {game.genres.length > 3 && (
              <span className="px-2 py-1 bg-gray-600 text-xs rounded-full text-gray-300">
                +{game.genres.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;