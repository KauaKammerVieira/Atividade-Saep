import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { loginSchema, registerSchema } from "../validators.js";

const router = Router();

router.post("/cadastro", async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existente = await User.findOne({ where: { email: data.email } });

    if (existente) {
      return res.status(409).json({ message: "E-mail já cadastrado." });
    }

    const senha = await bcrypt.hash(data.senha, 10);
    const usuario = await User.create({ ...data, senha });

    return res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    });
  } catch (error) {
    return res.status(400).json({ message: error.issues?.[0]?.message || "Dados inválidos." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const usuario = await User.findOne({ where: { email: data.email, ativo: true } });

    if (!usuario || !(await bcrypt.compare(data.senha, usuario.senha))) {
      return res.status(401).json({ message: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        foto: usuario.foto
      }
    });
  } catch (error) {
    return res.status(400).json({ message: error.issues?.[0]?.message || "Dados inválidos." });
  }
});

export default router;
