import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import ProfileSidebar from "../components/ProfileSidebar.jsx";
import Header from "../components/Header.jsx";
import Filters from "../components/Filters.jsx";
import ActivityCard from "../components/ActivityCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home({ onLogin }) {
  const { logado } = useAuth();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);
  const [tipo, setTipo] = useState("");
  const [pagina, setPagina] = useState(1);
  const [dados, setDados] = useState({ atividades: [], totalPaginas: 1 });
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);
    try {
      const { data } = await api.get("/api/atividades", {
        params: { page: pagina, tipo: tipo || undefined }
      });
      setDados(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    api.get("/api/empresa").then(res => setEmpresa(res.data));
  }, []);

  useEffect(() => {
    carregar();
  }, [pagina, tipo]);

  function mudarFiltro(novoTipo) {
    setTipo(novoTipo);
    setPagina(1);
  }

  return (
    <div className="app-grid">
      <ProfileSidebar empresa={empresa} />
      <main className="main">
        <Header
          logado={logado}
          onLogin={onLogin}
          onLogout={() => {}}
        />
        <Filters active={tipo} onChange={mudarFiltro} />

        <section className="activities-list">
          {loading && <p className="loading">Carregando atividades...</p>}
          {!loading && dados.atividades.length === 0 && (
            <p className="empty">Nenhuma atividade encontrada.</p>
          )}

          {!loading && dados.atividades.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onChange={carregar}
              onLogin={onLogin}
            />
          ))}
        </section>

        <Pagination
          pagina={pagina}
          totalPaginas={dados.totalPaginas}
          onChange={setPagina}
        />

        {logado && (
          <button className="floating-activity" onClick={() => navigate("/atividades")}>
            + Atividade
          </button>
        )}
      </main>
    </div>
  );
}
