import React from "react";

const CardDashboard = ({ bestGame }) => {
  if (!bestGame) {
    return (
      <div className="relative w-20 h-25 rounded-xl p-px bg-gray-900 backdrop-blur-md text-gray-800 overflow-hidden shadow-lg cursor-pointer">
        <div className="relative z-10 bg-gray-900/75 p-6 h-full w-full rounded-[11px] flex flex-col items-center justify-center text-center">
          <p className="text-white">No game data available.</p>
        </div>
      </div>
    );
  }

  const { name, cover, hoursPlayed, achievementsDone, achievementsTotal } = bestGame;

  const [visible, setVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const divRef = React.useRef(null);

  const handleMouseMove = (e) => {
    const bounds = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="relative w-64 h-auto rounded-xl p-px bg-gray-900 backdrop-blur-md text-gray-800 overflow-hidden shadow-lg cursor-pointer mx-auto"
    >
      {/* Efeito de luz que segue o rato */}
      <div
        className={`pointer-events-none blur-3xl rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-300 size-60 absolute z-0 transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ top: position.y - 120, left: position.x - 120 }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 bg-gray-900/75 p-3 w-full rounded-[4px] flex flex-col items-center justify-center text-center">
        <img
          src={cover}
          alt={`${name} cover`}
          className="w-24 h-36 rounded-md shadow-md my-2 object-cover mx-auto"
        />
        <h2 className="text-2xl font-bold text-white mb-1">
          {name}
        </h2>
        <div className="text-sm text-indigo-500 font-medium mb-4">
          {hoursPlayed} hours played
        </div>
        {/* Achievements removed as requested */}
      </div>
    </div>
  );
};

export default CardDashboard;
