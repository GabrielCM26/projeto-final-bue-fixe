import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <main className="relative bg-[#0f1012] min-h-screen text-white">
      <Component {...pageProps} />
      <Navbar />
    </main>
  );
}