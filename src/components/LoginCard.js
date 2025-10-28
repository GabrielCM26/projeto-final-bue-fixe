import { useState } from "react";

export default function RingLoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log("login");
  }

  const segments = Array.from({ length: 32 });

  return (
    <div className="min-h-screen w-full bg-[#101a25] flex items-center justify-center p-6 text-white font-sans">
      <div className="relative w-[360px] h-[360px] flex items-center justify-center">

        <div className="absolute inset-0">
          {segments.map((_, i) => {
            const angle = (360 / segments.length) * i;
            return (
              <div
                key={i}
                className={`
                  absolute left-1/2 top-1/2
                  h-[46px] w-[10px]
                  rounded-[6px]
                  bg-[#2b3c4e]
                `}
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(260px)`,
                }}
              />
            );
          })}
        </div>

        <div className="absolute inset-0">
          {segments.map((_, i) => {
            const angle = (360 / segments.length) * i;
            const duration = 5; 
            const delay = (i / segments.length) * duration;

            return (
              <div
                key={i}
                className={`
                  absolute left-1/2 top-1/2
                  h-[44px] w-[10px]
                  rounded-[6px]
                  bg-transparent
                  [animation:segmentGlow_5s_linear_infinite]
                `}
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(260px)`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>

        <div
          className={`
            relative z-10
            flex flex-col items-center text-center
            w-[260px]
            rounded-2xl
            bg-[#1b2533]
            px-3 py-6
            border border-[rgba(255,255,255,0.08)]
          `}
        >
          <h2 className="text-cyan-300 text-xl font-semibold mb-6 tracking-wide">
            Login
          </h2>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-5 text-left"
          >
            {/* Email */}
            <input
              className={`
                w-full
                bg-transparent
                border border-[#2d3950]
                rounded-lg
                px-4 py-2
                text-sm text-white
                placeholder-gray-400
                outline-none
                focus:border-cyan-400
                focus:shadow-[0_0_10px_rgba(0,255,255,0.6)]
              `}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <input
              className={`
                w-full
                bg-transparent
                border border-[#2d3950]
                rounded-lg
                px-4 py-2
                text-sm text-white
                placeholder-gray-400
                outline-none
                focus:border-cyan-400
                focus:shadow-[0_0_10px_rgba(0,255,255,0.6)]
              `}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-[11px] text-gray-400 text-center -mt-2">
              Forgot your password?
            </div>

            <button
              type="submit"
              className={`
                mt-2
                w-full
                rounded-lg
                bg-gradient-to-r from-cyan-400 to-cyan-500
                text-[#0b1a24]
                font-semibold text-sm
                py-2
                shadow-[0_15px_40px_rgba(0,255,255,0.4)]
                hover:shadow-[0_20px_60px_rgba(0,255,255,0.6)]
                hover:brightness-110
                active:scale-[0.98]
                transition-all
              `}
            >
              Login
            </button>

            <button
              type="button"
              className="text-[12px] text-cyan-300 hover:text-cyan-200 mt-2 text-center"
              onClick={() => console.log("signup")}
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
