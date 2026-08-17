import { Router } from "express";
import { Company, Activity } from "../models/index.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const company = await Company.findOne();
    const totalAtividades = await Activity.count();
    const totalCalorias = (await Activity.sum("calorias")) || 0;

    res.json({
      id: company?.id,
      nome: company?.nome || "SAEPSaúde",
      logo: company?.logo || "/assets/SAEPSaude.png",
      totalAtividades,
      totalCalorias
    });
  } catch {
    res.status(500).json({ message: "Erro ao carregar dados da empresa." });
  }
});

export default router;
