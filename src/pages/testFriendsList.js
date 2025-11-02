import { useRouter } from "next/router";


export default function FriendList() {

    return (
        <main>
            <div>
                {/* Botão para voltar atrás */}
                <button>
                    <p>hi</p>
                </button>
                {/* Título */}
                <h1>
                    Your Friends
                </h1>
            </div>
            {/* Barra de pesquisa */}
            <div className="bg-[#2B303B] rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-gray-400">
                <span>⌕</span>
                <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-gray-200 placeholder-gray-500 w-full text-sm"
                />
            </div>
            <div>
                {/* Lista de amigos */}
                <ul>
                    {/* Cada amigo */}
                    <div>
                        <img />
                        <p>Friend!</p>
                    </div>
                </ul>
            </div>
        </main>
    )
}