import { Router } from "express";
import { Op } from "sequelize";
import { Activity, User, Like, Comment } from "../models/index.js";
import { auth } from "../middleware/auth.js";
import { activitySchema, commentSchema } from "../validators.js";

const router = Router();

function normalize(activity, likes, comments, liked) {
  const a = activity.toJSON();
  return {
    ...a,
    usuario: {
      id: a.User?.id,
      nome: a.User?.nome,
      foto: a.User?.foto
    },
    likes,
    comentarios: comments,
    liked
  };
}

router.get("/", async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = 4;
    const offset = (page - 1) * limit;
    const tipo = req.query.tipo;

    const where = tipo && ["corrida", "caminhada", "trilha"].includes(tipo)
      ? { tipo }
      : {};

    const { rows, count } = await Activity.findAndCountAll({
      where,
      include: [{ model: User, attributes: ["id", "nome", "foto"] }],
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });

    const result = await Promise.all(rows.map(async activity => {
      const likes = await Like.count({ where: { activityId: activity.id } });
      const comments = await Comment.count({ where: { activityId: activity.id } });
      return normalize(activity, likes, comments, false);
    }));

    res.json({
      atividades: result,
      pagina: page,
      porPagina: limit,
      total: count,
      totalPaginas: Math.max(Math.ceil(count / limit), 1)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar atividades." });
  }
});

router.get("/minhas", auth, async (req, res) => {
  try {
    const rows = await Activity.findAll({
      where: { userId: req.usuario.id },
      include: [{ model: User, attributes: ["id", "nome", "foto"] }],
      order: [["createdAt", "DESC"]]
    });

    const result = await Promise.all(rows.map(async activity => {
      const likes = await Like.count({ where: { activityId: activity.id } });
      const comments = await Comment.count({ where: { activityId: activity.id } });
      return normalize(activity, likes, comments, false);
    }));

    res.json(result);
  } catch {
    res.status(500).json({ message: "Erro ao listar suas atividades." });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const data = activitySchema.parse(req.body);
    const activity = await Activity.create({ ...data, userId: req.usuario.id });
    const result = await Activity.findByPk(activity.id, {
      include: [{ model: User, attributes: ["id", "nome", "foto"] }]
    });
    res.status(201).json(normalize(result, 0, 0, false));
  } catch (error) {
    res.status(400).json({ message: error.issues?.[0]?.message || "Dados inválidos." });
  }
});

router.get("/:id/interacao", auth, async (req, res) => {
  const activityId = Number(req.params.id);
  const liked = Boolean(await Like.findOne({ where: { activityId, userId: req.usuario.id } }));
  const likes = await Like.count({ where: { activityId } });
  const comentarios = await Comment.count({ where: { activityId } });
  res.json({ liked, likes, comentarios });
});

router.post("/:id/like", auth, async (req, res) => {
  const activityId = Number(req.params.id);
  const activity = await Activity.findByPk(activityId);
  if (!activity) return res.status(404).json({ message: "Atividade não encontrada." });

  const existente = await Like.findOne({ where: { activityId, userId: req.usuario.id } });

  if (existente) await existente.destroy();
  else await Like.create({ activityId, userId: req.usuario.id });

  const likes = await Like.count({ where: { activityId } });
  res.json({ liked: !existente, likes });
});

router.post("/:id/comentarios", auth, async (req, res) => {
  try {
    const activityId = Number(req.params.id);
    const data = commentSchema.parse(req.body);
    const activity = await Activity.findByPk(activityId);

    if (!activity) return res.status(404).json({ message: "Atividade não encontrada." });

    const comentario = await Comment.create({
      texto: data.texto,
      activityId,
      userId: req.usuario.id
    });

    const comentarios = await Comment.count({ where: { activityId } });
    res.status(201).json({ comentario, comentarios });
  } catch (error) {
    res.status(400).json({ message: error.issues?.[0]?.message || "Comentário inválido." });
  }
});

export default router;
