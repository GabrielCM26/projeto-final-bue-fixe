// ===== CONSTANTES FIXAS =====
const express = require("express");
const next = require("next");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./lib/mongodb");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();
app.use(cors());
app.use(express.json());
const Profile = require("./src/models/profile");

// ===== ENDPOINTS DA API =====

app.get("api/profiles/:steamID", async (req, res) => {
  const { steamID } = req.params;

  try {
    const profile = await Profile.findOne({ steamID });
    if (!profile) {
      return res.status(404).json({ message: "Perfil não encontrado" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

app.post("/api/profiles", async (req, res) => {
  const profileData = req.body;

  try {
    const profile = await Profile.findOneAndUpdate(
      { steamID: profileData.steamID },
      profileData,
      { new: true, upsert: true }
    );
    res.status(201).json(profile);
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// ===== STEAM LOGIN=====





// ===== INICIALIZAÇÃO DO SERVIDOR (também não se deve mexer)=====

app.use((req, res) => {
  return handle(req, res);
});

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
  try {
    await connectDB();
    await nextApp.prepare();
    app.listen(PORT, () => {
      console.log(
        `Servidor Next.js + Express a correr em http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

iniciarServidor();
