import {useRouter} from "next/router";

export default function Dashboard() {
const router = useRouter();
const {steamid} = router.query;
 
const mockUser = {
    personaname: "user",
    avatar:
      "https://avatars.cloudflare.steamstatic.com/placeholder_full.jpg",
    
};
  return (
    <main className="min-h-screen bg-[#0f1012] text-white flex justify-center p-4">
      <section className="w-full max-w-xs bg-[#1a1c20] rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
        {/* HEADER */}
        <header className="flex justify-between items-start">
          <div className="text-white font-semibold text-lg">Playdex</div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-200 truncate max-w-[6rem]">
              {mockUser.personaname}
            </div>

            <div className="w-6 h-6 rounded-full bg-gray-500 overflow-hidden">
              <img
                src={mockUser.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-4 h-4 rounded-full bg-gray-300" />
          </div>
        </header>
         {/* Barra*/}
        <div className="bg-[#2a2c33] rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-gray-400">
      <span></span>
    <input
    type="text"
    placeholder="Search"
    className="bg-transparent outline-none text-gray-200 placeholder-gray-500 w-full text-sm"
  />
</div>

        <div className="text-[10px] text-gray-500">
          steamid atual: {steamid || "(sem steamid )"}
        </div>
      </section>
    </main>
 )
}