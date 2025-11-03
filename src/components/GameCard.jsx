import React, { useState } from "react";
import { Trophy, Clock } from 'lucide-react';

const GameCard = ({ game }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const threshold = 30;

  const handleMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setTilt({ x: y * -threshold, y: x * threshold });
  };

  const handleLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleCardClick = () => {
    if (game.appid) {
      const steamUrl = `https://store.steampowered.com/app/${game.appid}`;
      window.open(steamUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('No Steam App ID available for this game:', game.name);
    }
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
      className="rounded-xl shadow-xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer w-full max-w-[175px] bg-black shadow-xs shadow-green-500/80 relative h-56 hover:scale-125 hover:z-2"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleCardClick}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
      }}
    >
      {/* Game poster/header image */}
      <div className="relative w-full h-20 bg-gray-800 overflow-hidden">
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
      </div>

      {/* Game info section */}
      <div className="p-3 text-white">
        <h3 className="text-sm font-semibold text-white mb-1 truncate">
          {game.name}
        </h3>
        {/* Playtime */}
        <div className="flex items-center mb-1">
          <Clock size={14} color="#76bdea" strokeWidth={2} />
          <span className="text-xs text-gray-300 ml-1">{formatPlaytime(game.playtime_forever)}</span>
        </div>
        {/* Achievements */}
        <div className="flex items-center mb-2">
          <Trophy size={14} color="#f9e358" strokeWidth={2} />
          <span className="text-xs text-gray-300 ml-1">Achievements</span>
          <span className="ml-auto text-xs font-semibold text-yellow-400">{achievementProgress}</span>
        </div>
        {game.achievements && game.achievements.length > 0 && (
          <div className="w-full bg-gray-600 rounded-full h-1 mb-2">
            <div
              className="bg-green-500 h-1 rounded-full"
              style={{
                width: `${(game.achievements.filter(a => a.achieved).length / game.achievements.length) * 100}%`
              }}
            ></div>
          </div>
        )}
        {/* Genres */}
        {game.genres && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 overflow-hidden w-full">
            {game.genres.slice(0, 3).map((genre, index) => (
              <span key={index}
                className="px-2 py-1 bg-gray-700 text-[10px] rounded-full text-gray-300 whitespace-nowrap truncate"
                style={{ maxWidth: '70%' }}>
                {genre.description}
              </span>
            ))}
            {game.genres.length > 3 && (
              <span className="px-2 py-1 bg-gray-700 text-[10px] rounded-full text-gray-300">
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
