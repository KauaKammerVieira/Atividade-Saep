import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize, User, Activity } from "../src/models/index.js";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "..", "data");

function parseCsv(file) {
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").trim();
  if (!text) return [];

  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(";").map(x => x.trim().toLowerCase());

  return lines.slice(1).map(line => {
    const values = line.split(";");
    return Object.fromEntries(headers.map((h, i) => [h, values[i]?.trim() ?? ""]));
  });
}

const get = (row, names, fallback = "") => {
  const key = Object.keys(row).find(k => names.includes(k.toLowerCase()));
  return key ? row[key] : fallback;
};

await sequelize.sync({ alter: true });

const usuarios = parseCsv(path.join(dataDir, "usuarios.csv"));
const atividades = parseCsv(path.join(dataDir, "atividades.csv"));
const senhaPadrao = await bcrypt.hash("123456", 10);

for (const row of usuarios) {
  const email = get(row, ["email", "e-mail"]);
  const nome = get(row, ["nome", "usuario", "usuário", "name"]);
  const foto = get(row, ["foto", "imagem", "avatar", "foto_perfil"], null);

  if (!email || !nome) continue;

  await User.findOrCreate({
    where: { email },
    defaults: { nome, email, foto, senha: senhaPadrao }
  });
}

for (const row of atividades) {
  const email = get(row, ["email", "usuario_email", "e-mail"]);
  const nomeUsuario = get(row, ["usuario", "nome", "nome_usuario"]);
  const user = email
    ? await User.findOne({ where: { email } })
    : await User.findOne({ where: { nome: nomeUsuario } });

  if (!user) continue;

  const tipo = get(row, ["tipo", "atividade", "titulo", "title"]).toLowerCase();
  const distancia = Number(get(row, ["distancia", "distancia_metros", "distanciametros", "metros"]));
  const duracao = Number(get(row, ["duracao", "duracao_minutos", "duracaominutos", "minutos"]));
  const calorias = Number(get(row, ["calorias", "calories"]));

  if (!["corrida", "caminhada", "trilha"].includes(tipo)) continue;
  if (!distancia || !duracao || !calorias) continue;

  await Activity.create({
    tipo,
    distanciaMetros: distancia,
    duracaoMinutos: duracao,
    calorias,
    userId: user.id
  });
}

console.log("Importação dos CSVs concluída.");
await sequelize.close();
