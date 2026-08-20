import React from "react";
import { LogOut } from "lucide-react";

export default function Header({ logado, onLogin, onLogout }) {
  return (
    <header className="header">
      {logado ? (
        <button className="header-btn logout" onClick={onLogout}>
          <LogOut size={16} />
          Logout
        </button>
      ) : (
        <button className="header-btn" onClick={onLogin}>Login</button>
      )}
    </header>
  );
}
