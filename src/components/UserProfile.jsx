export default function UserProfile() {
    return (
        <div>
            <div>

                {/* Foto de perfil */}
                <img />
                <div>

                    {/* Nome de Utilizador */}
                    <h1>
                        Steam Username
                    </h1>
                    <div>

                        {/* "Roles" com Genres */}
                        <ul>
                            <li>Rhythm Game</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Biografia do Usuário; opcional */}
            <div>
                <p>Hi! Test 1 2 3</p>
            </div>

            {/* Div que demonstra as 10 achievements mais recentes (opcional); leva depois à página dos achievements todos */}
            <div>
                <h3>My most recent achievements</h3>
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                </ul>
                <a>view all...</a>
            </div>

            {/* Fake div que leva à página dos amigos */}
            <button>
                <p>I have (X) friends!</p>
            </button>

            {/* Div com botão e flavor text */}
            <div>
                <p>Who has the most games platinumed? Click here to check!</p>
                <button>
                    <p>Leaderboard</p>
                </button>
            </div>
        </div>
    )
}