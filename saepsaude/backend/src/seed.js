import "dotenv/config";
import bcrypt from "bcryptjs";
import { sequelize, User, Company, Activity, Like, Comment } from "./models/index.js";

await sequelize.sync({ alter: true });

const senha = await bcrypt.hash("123456", 10);

const [company] = await Company.findOrCreate({
  where: { id: 1 },
  defaults: { nome: "SAEPSaúde", logo: "/assets/SAEPSaude.png" }
});

const users = [];
for (const item of [
  { nome: "Usuario_01", email: "usuario01@saepsaude.com", foto: "/assets/avatar1.svg" },
  { nome: "Usuario_02", email: "usuario02@saepsaude.com", foto: "/assets/avatar2.svg" },
  { nome: "Usuario_03", email: "usuario03@saepsaude.com", foto: "/assets/avatar3.svg" }
]) {
  const [user] = await User.findOrCreate({
    where: { email: item.email },
    defaults: { ...item, senha }
  });
  users.push(user);
}

if (await Activity.count() === 0) {
  await Activity.bulkCreate([
    { tipo: "corrida", distanciaMetros: 10000, duracaoMinutos: 50, calorias: 350, userId: users[0].id, createdAt: new Date("2024-08-12T18:30:00") },
    { tipo: "trilha", distanciaMetros: 10000, duracaoMinutos: 50, calorias: 350, userId: users[1].id, createdAt: new Date("2024-08-15T20:40:00") },
    { tipo: "caminhada", distanciaMetros: 5000, duracaoMinutos: 50, calorias: 350, userId: users[0].id, createdAt: new Date("2024-07-09T05:30:00") },
    { tipo: "corrida", distanciaMetros: 3000, duracaoMinutos: 50, calorias: 350, userId: users[1].id, createdAt: new Date("2024-07-07T17:20:00") },
    { tipo: "caminhada", distanciaMetros: 7000, duracaoMinutos: 70, calorias: 420, userId: users[2].id },
    { tipo: "trilha", distanciaMetros: 4500, duracaoMinutos: 90, calorias: 500, userId: users[2].id }
  ]);
}

console.log("Seed concluído.");
console.log("Login: usuario03@saepsaude.com / 123456");
await sequelize.close();
