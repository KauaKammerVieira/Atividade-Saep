import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import ProfileSidebar from "../components/ProfileSidebar.jsx";
import Header from "../components/Header.jsx";
import ActivityForm from "../components/ActivityForm.jsx";
import ActivityCard from "../components/ActivityCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Activities({ onLogin }) {
  const { logado, logout } = useAuth();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);
  const [atividades, setAtividades] = useState([]);

  async function carregar() {
    const { data } = await api.get("/api/atividades/minhas");
    setAtividades(data);
  }

  useEffect(() => {
    api.get("/api/empresa").then(res => setEmpresa(res.data));
    carregar();
  }, []);

  async function criar(form) {
    await api.post("/api/atividades", form);
    await carregar();
  }

  return (
    <div className="app-grid">
      <ProfileSidebar empresa={empresa} active />
      <main className="main">
        <Header
          logado={logado}
          onLogin={onLogin}
          onLogout={() => {
            logout();
            navigate("/");
          }}
        />

        <div className="filters">
          <button onClick={() => navigate("/")}>Corrida</button>
          <button onClick={() => navigate("/")}>Caminhada</button>
          <button onClick={() => navigate("/")}>Trilha</button>
        </div>

        <ActivityForm onSubmit={criar} />

        <h2 className="section-title">Suas Atividades</h2>

        <section className="activities-list">
          {atividades.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onChange={carregar}
              onLogin={onLogin}
            />
          ))}
          {atividades.length === 0 && <p className="empty">Você ainda não possui atividades.</p>}
        </section>
      </main>
    </div>
  );
}
