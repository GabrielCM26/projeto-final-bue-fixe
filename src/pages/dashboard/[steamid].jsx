import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { steamid } = router.query;

  const [profile, setProfile] = useState(null);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    if (!steamid) return;

    async function loadProfile() {
      try {
        const res = await fetch(`/api/profiles/${steamid}`);
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    }
    

    loadProfile();
  }, [steamid]);

  if (!profile) {
    return (
      <main className="min-h-screen text-white flex justify-center items-center p-4">
        <div className="text-gray-500 text-sm">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white flex justify-center p-4">
      <section className="w-full max-w-xs bg-[#1a1c20] rounded-2xl p-4 flex flex-col gap-6 shadow-xl">

        {/* HEADER */}
        <header className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <img
              src="/Logo.png"
              alt="PlayDex logo"
              className="w-25 h-6 object-contain"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-200 truncate max-w-[6rem]">
              {profile?.personaname || "user"}
            </div>

            <div className="w-6 h-6 rounded-full bg-gray-500 overflow-hidden">
              {profile?.avatar && (
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </header>

        {/* Barra */}
        <div className="bg-[#2B303B] rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-gray-400">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-gray-200 placeholder-gray-500 w-full text-sm"
          />
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="mt-10 flex flex-col gap-7">
          <div className="flex gap-2 mt-4 text-center">
            
            {/* HOURS PLAYED */}
            <div className="flex-1 bg-[#2a2c33] rounded-md p-3 flex flex-col justify-between ">
              <div className="text-white font-semibold text-lg ">1,239</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                Hours played
              </div>
            </div>

            {/* GAMES OWNED */}
            <div className="flex-1 bg-[#2a2c33] rounded-md p-3 flex flex-col justify-between">
              <div className="text-white font-semibold text-lg ">57</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                Games owned
              </div>
            </div>

            {/* STEAM LEVEL */}
            <div className="flex-1 bg-[#2a2c33] rounded-md p-3 flex flex-col justify-between">
              <div className="text-white font-semibold text-lg leading-none">
                {profile?.steamLevel
                  ? `Lv ${profile.steamLevel}`
                  : "Lv --"}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                Steam level
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            {/* SUGGESTED GAMES */}
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#2a2c33] rounded-md py-3 px-2 text-xs text-gray-300 hover:bg-[#34363d] transition">
              <img
                src="/ListaIcon1.png"
                alt="list icon"
                className="w-9 h-9 opacity-80"
              />
              <span className="">
                Suggested <br /> Games
              </span>
            </button>

            {/* MONEY WASTED */}
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#2a2c33] rounded-md py-3 px-2 text-xs text-gray-300 hover:bg-[#34363d] transition">
              <img
                src="/money.png"
                alt="list icon"
                className="w-9 h-9 opacity-80"
              />
              <span className="">
                Money
                <br /> Wasted
              </span>
            </button>
          </div>

          {/* TOP FRIENDS BY ACHIEVEMENTS */}
          <div className="bg-[#2a2c33] rounded-md p-3 flex flex-col gap-3 mt-3">
            <div className="text-xs text-gray-200 font-medium">
              Top friends by Achievements
            </div>

            <div className="flex justify-between">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src="/avatar-placeholder.png"
                    alt={`Friend ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* BEST ACHIEVEMENTS */}
          <div className="bg-[#2a2c33] rounded-md p-2 flex flex-col gap-4 mt-3">
            <div className="text-xs text-gray-200 font-medium">
              Best achievements
            </div>

            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-1 bg-[#2a2c33] rounded-md p-4 flex items-center justify-center"
                >
                  <img
                    src="/trophy-placeholder.png"
                    alt={`Trophy ${i}`}
                    className="w-8 h-8 object-contain opacity-80"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-[10px] text-gray-500">
          steamid atual: {steamid || "(sem steamid )"}
        </div>
      </section>
    </main>
  );
}
