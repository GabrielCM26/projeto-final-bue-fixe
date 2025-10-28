import React from 'react';

export default function SteamLogin() {
  const handleLogin = () => {
    window.location.href = '/auth/steam';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <button onClick={handleLogin} className="focus:outline-none">
        <img
          src="https://web.archive.org/web/20150227040200im_/http://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_large_noborder.png"
          alt="Sign in through Steam"
          className="cursor-pointer w-48 hover:opacity-80 transition-opacity duration-200"
        />
      </button>
    </div>
  );
}
