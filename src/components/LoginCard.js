export default function LoginCard() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-lime-400 mb-2">Welcome</h1>
      <h2 className="text-neutral-300 mb-6">"logo" PlayDex</h2>
      <button
        className="
          bg-lime-400 hover:bg-lime-500
          text-neutral-900 font-semibold
          py-2 px-4 rounded-lg transition
        "
      >
        Connect Steam
      </button>
    </div>
  );
}
