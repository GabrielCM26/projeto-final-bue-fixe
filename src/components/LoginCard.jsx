import { Jura } from "next/font/google";

const juraFont = Jura({
  subsets: ["latin"],
  weight: "400",
})

export default function LoginCard() {
  const handleLogin = () => {
    window.location.href = '/auth/steam';
  };

  return (
    <div className=" w-[75vw] bg-black rounded-2xl border border-[#aae4c1] items-center justify-center text-center p-5 pb-10 md:w-[50vw]">
      <h1 className={`text-white text-[24px] mb-15 mt-2 ${juraFont.className}`}>"logo" Play<span className="text-[#58CE87]">Dex</span></h1>

      <button onClick={handleLogin} className="mb-5">
        <img
          src="/Steam_Login.png"
          alt="Sign in through Steam"
          className="w-40 cursor-pointer"
        />
      </button>

      <p className="text-neutral-500 text-sm"><i>To access this app, we ask that our users log in through their Steam account. We do not collect any sensitive information.</i></p>
    </div>
  );
}
