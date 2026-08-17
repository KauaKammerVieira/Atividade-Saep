import { useEffect, useState } from "react";
import { Heart, MessageSquare, Send } from "lucide-react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

function formatDate(value) {
  const d = new Date(value);
  const pad = n => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())} - ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(-2)}`;
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours}h ${rest}min` : `${minutes} min`;
}

export default function ActivityCard({ activity, onChange, onLogin }) {
  const { logado } = useAuth();
  const [liked, setLiked] = useState(activity.liked || false);
  const [likes, setLikes] = useState(activity.likes || 0);
  const [comments, setComments] = useState(activity.comentarios || 0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!logado) return;
    api.get(`/api/atividades/${activity.id}/interacao`)
      .then(({ data }) => {
        setLiked(data.liked);
        setLikes(data.likes);
        setComments(data.comentarios);
      })
      .catch(() => {});
  }, [activity.id, logado]);

  async function toggleLike() {
    if (!logado) {
      onLogin();
      return;
    }
    const { data } = await api.post(`/api/atividades/${activity.id}/like`);
    setLiked(data.liked);
    setLikes(data.likes);
  }

  async function enviarComentario(e) {
    e.preventDefault();

    if (!logado) {
      onLogin();
      return;
    }

    if (texto.trim().length < 3) {
      setError("não é possível enviar um comentário vazio");
      return;
    }

    try {
      const { data } = await api.post(`/api/atividades/${activity.id}/comentarios`, {
        texto: texto.trim()
      });
      setComments(data.comentarios);
      setTexto("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao enviar comentário.");
    }
  }

  return (
    <article className="activity-card">
      <div className="activity-date">{formatDate(activity.createdAt)}</div>

      <h3>{activity.tipo}</h3>

      <div className="activity-content">
        <img
          className="avatar"
          src={activity.usuario?.foto || "/assets/avatar-placeholder.svg"}
          alt={activity.usuario?.nome}
        />

        <div className="user-block">
          <strong>{activity.usuario?.nome || "Usuário"}</strong>
        </div>

        <div className="metric">
          <strong>{(activity.distanciaMetros / 1000).toFixed(1)} km</strong>
          <span>Distância</span>
        </div>

        <div className="metric">
          <strong>{formatDuration(activity.duracaoMinutos)}</strong>
          <span>Duração</span>
        </div>

        <div className="metric">
          <strong>{activity.calorias}</strong>
          <span>Calorias</span>
        </div>

        <div className="actions">
          <button className={`icon-action ${liked ? "liked" : ""}`} onClick={toggleLike}>
            <Heart size={25} fill={liked ? "currentColor" : "none"} />
            <span>{likes}</span>
          </button>

          <button
            className="icon-action"
            onClick={() => {
              if (!logado) onLogin();
              else setCommentOpen(v => !v);
            }}
          >
            <MessageSquare size={23} />
            <span>{comments}</span>
          </button>
        </div>
      </div>

      {commentOpen && (
        <form className="comment-box" onSubmit={enviarComentario}>
          <input
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Escrever um comentário..."
          />
          <button type="submit" aria-label="Enviar comentário">
            <Send size={21} />
          </button>
          {error && <p className="form-error">{error}</p>}
        </form>
      )}
    </article>
  );
}
