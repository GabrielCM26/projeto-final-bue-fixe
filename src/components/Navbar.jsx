import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const path = router.asPath;

  // páginas onde NÃO queremos mostrar a navbar (ex: login)
  const hideOn = ["/", "/testLogin"];
  if (hideOn.includes(path)) {
    return null;
  }

  const match = path.match(/\/(\d{17,})/);
  const steamid = match ? match[1] : null;

  const ROUTES = {
    home: "dashboard",
    games: "allGames",
    friends: "friendsList",
    user: "userprofile",
  };

  const [active, setActive] = useState("home");

  // atualiza a tab ativa conforme a rota atual
  useEffect(() => {
    for (const [key, route] of Object.entries(ROUTES)) {
      if (path.startsWith(`/${route}`)) {
        setActive(key);
        return;
      }
    }
  }, [path]);

  const go = (tab, href) => {
    setActive(tab);
    router.push(href);
  };

  return (
    <nav
      className="
        fixed bottom-8 left-1/2 -translate-x-1/2 z-50
        flex items-center justify-around
        bg-gradient-to-br from-[#1a1c20] via-[#1e2126] to-[#25282e]
        border border-[#25282e]
        rounded-full
        px-2 py-2
        w-[40%] max-w-md min-w-[260px]
        shadow-[0_35px_120px_rgba(0,0,0,0.9)]
        backdrop-blur-md
      "
    >
      {[
        { key: "home", label: "Home", icon: <IconHome /> },
        { key: "games", label: "Games", icon: <IconGames /> },
        { key: "friends", label: "Friends", icon: <IconFriends /> },
        { key: "user", label: "Profile", icon: <IconUser /> },
      ].map((item) => {
        const base = ROUTES[item.key];
        const href = steamid ? `/${base}/${steamid}` : "/";

        return (
          <button
            key={item.key}
            onClick={() => go(item.key, href)}
            className={`
              relative flex flex-col items-center
              text-[10px] font-medium leading-none
              transition-all
              px-2 py-1
              ${
                active === item.key
                  ? "text-[#aae4c1]"
                  : "text-gray-400 hover:text-[#aae4c1]"
              }
            `}
          >
            {/* ícone + glow */}
            <div className="relative flex items-center justify-center">
              {item.icon}
              {active === item.key && (
                <div
                  className="
                    absolute inset-0
                    blur-lg
                    rounded-full
                    opacity-20
                    pointer-events-none
                  "
                  style={{ backgroundColor: "#aae4c1" }}
                />
              )}
            </div>

            <span className="mt-1">{item.label}</span>

            {active === item.key && (
              <div
                className="
                  absolute -bottom-2 left-1/2 -translate-x-1/2
                  h-[2px] w-6 rounded-full
                  shadow-[0_0_8px_rgba(170,228,193,0.7)]
                "
                style={{ backgroundColor: "#aae4c1" }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

function IconHome() {
  return (
    <svg
      className="w-4 h-4 relative z-10"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 3 3 9v12h6v-6h6v6h6V9z" />
    </svg>
  );
}

function IconGames() {
  return (
    <svg
      className="w-5 h-5 relative z-10"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8zm2 0v8h14V8H5zm2 2h2v1h2v2H9v1H7v-1H5v-2h2v-1zm8 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm2-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
    </svg>
  );
}

function IconFriends() {
  return (
    <svg
      className="w-4 h-4 relative z-10"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm6 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM2 17.5C2 15 6 14 9 14s7 1 7 3.5V20H2v-2.5Zm13.5-3c1.6 0 4.5.8 4.5 2.5V20h-4v-2.5c0-1-.3-1.9-1-2.7.8-.2 1.7-.3 2.5-.3Z" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg
      className="w-4 h-4 relative z-10"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10ZM5 19.5C5 16.5 8.5 15 12 15s7 1.5 7 4.5V22H5v-2.5Z" />
    </svg>
  );
}

