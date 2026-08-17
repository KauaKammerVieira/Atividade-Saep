import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(1, "Senha obrigatória.")
});

export const registerSchema = z.object({
  nome: z.string().trim().min(2, "Nome obrigatório."),
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.")
});

export const activitySchema = z.object({
  tipo: z.enum(["corrida", "caminhada", "trilha"]),
  distanciaMetros: z.coerce.number().int().positive(),
  duracaoMinutos: z.coerce.number().int().positive(),
  calorias: z.coerce.number().int().positive()
});

export const commentSchema = z.object({
  texto: z.string().trim().min(3, "O comentário deve possuir pelo menos 3 caracteres.").max(500)
});
