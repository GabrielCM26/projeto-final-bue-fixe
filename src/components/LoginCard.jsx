import Image from "next/image";
import Link from "next/link";

export default function LoginCard() {
  const handleLogin = () => {
    window.location.href = '/auth/steam';
  };

  return (
    <div className=" w-[150px] h-[150px] bg-[#0d0f0e] rounded-2xl border border-[#58CE87] shadow-[0_0_15px_rgba(144,238,144,0.1)] items-center justify-center text-center">
      <h2 className="text-neutral-400 mb-6">"logo" PlayDex</h2>

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
