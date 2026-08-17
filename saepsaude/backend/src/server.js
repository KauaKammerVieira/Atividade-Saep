import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { sequelize } from "./models/index.js";
import authRoutes from "./routes/auth.routes.js";
import companyRoutes from "./routes/company.routes.js";
import activityRoutes from "./routes/activity.routes.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Muitas tentativas. Aguarde um minuto." }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", loginLimiter, authRoutes);
app.use("/api/empresa", companyRoutes);
app.use("/api/atividades", activityRoutes);

const PORT = Number(process.env.PORT || 3000);

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("Erro ao iniciar:", error);
  process.exit(1);
}
