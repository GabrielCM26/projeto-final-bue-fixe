import Image from "next/image";
import LoginCard from "@/components/LoginCard"; 

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-t from-[#000d12] from-88% to-[#001334]">
      <div className="relative">
        <div className="absolute transform -translate-x-1/2 left-1/2 bottom-1/2">
         <LoginCard />
        </div>
        <img src="/Login_BG.png" />
      </div>

      <div className="relative z-10">
      </div>
    </main>
  );
}
