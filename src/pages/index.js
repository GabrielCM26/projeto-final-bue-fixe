import Image from "next/image";
import LoginCard from "@/components/LoginCard"; 

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">
      <div className="bg-[url(../../public/Login_BG.png)]">

      </div>
      <img
        src="/Login_BG.png"
        alt="PlayDex wallpaper"
        fill
        priority
        className="object-contain bg-black object-[center_50%] rounded-3xl"
        
        sizes="400vw"
      />

      <div className="relative z-10">
        <LoginCard />
      </div>
    </main>
  );
}
