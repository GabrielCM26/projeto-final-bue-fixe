import Image from "next/image";
import Link from "next/link";

export default function LoginCard() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-lime-400 mb-2">Welcome</h1>
      <h2 className="text-neutral-300 mb-6">"logo" PlayDex</h2>

      <Link href="https://steamcommunity.com/openid/login">
        <Image
          src="/logoSteam.png"
          alt="Sign in through Steam"
          width={100}
          height={75}
          className="mx-auto hover:opacity-90 transition"
        />
      </Link>
    </div>
  );
}
