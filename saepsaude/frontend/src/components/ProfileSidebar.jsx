import React from "react";
import { Activity as ActivityIcon } from "lucide-react";

export default function ProfileSidebar({ empresa, active = false }) {
  return (
    <aside className="sidebar">
      <div className="profile-top">
        <img
          className="company-logo"
          src={empresa?.logo || "/assets/SAEPSaude.png"}
          alt="SAEPSaúde"
          onError={e => { e.currentTarget.style.display = "none"; }}
        />
        <h1>{empresa?.nome || "SAEPSaúde"}</h1>

        <div className="company-stats">
          <div>
            <strong>{empresa?.totalAtividades ?? 0}</strong>
            <span>Qtd. Atividades</span>
          </div>
          <div>
            <strong>{empresa?.totalCalorias ?? 0}</strong>
            <span>Qtd. Calorias</span>
          </div>
        </div>

        <div className={`activity-nav ${active ? "active" : ""}`}>
          <ActivityIcon size={21} />
          <span>Atividade</span>
        </div>
      </div>

      <footer className="sidebar-footer">
        <strong>SAEPSaúde</strong>
        <div className="socials">
          <img src="/assets/Instagram.svg" alt="Instagram" />
          <img src="/assets/Twitter.svg" alt="Twitter" />
          <img src="/assets/TikTok.svg" alt="TikTok" />
        </div>
        <small>Copyright-2024</small>
      </footer>
    </aside>
  );
}
