import LoginCard from "@/components/LoginCard"; 

export default function Home() {
  return (
    <main className="flex max-h-screen items-center justify-center bg-linear-to-t from-[#000d12] from-88% to-[#001334] overflow-hidden">
      <div className="relative">
        <div className="absolute transform -translate-x-1/2 left-1/2 top-80 overflow-hidden shadow-[0_0_8px_rgba(88,206,135,0.5)] rounded-2xl">
         <LoginCard />
        </div>
        <img src="/Login_BG.png" className="overflow-hidden mt-[70px] max-w-[440px] md:mt-[1vh]"/>
      </div>
    </main>
  );
}
