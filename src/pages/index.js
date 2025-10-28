import Image from "next/image";
import LoginCard from "@/components/LoginCard"; 

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-black overflow-hidden">

      <Image
        src="/loginCard.png"
        alt="PlayDex wallpaper"
        fill
        priority
        className="object-contain bg-black"
        sizes="100vw"
      />

      <div className="relative z-10">
        <LoginCard />
      </div>
    </main>
  );
}
