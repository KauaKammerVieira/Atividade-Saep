import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem("saepsaude_usuario");
    return saved ? JSON.parse(saved) : null;
  });

  async function login(email, senha) {
    const { data } = await api.post("/auth/login", { email, senha });

    localStorage.setItem("saepsaude_token", data.token);
    localStorage.setItem(
      "saepsaude_usuario",
      JSON.stringify(data.usuario)
    );

    setUsuario(data.usuario);
  }

  function logout() {
    localStorage.removeItem("saepsaude_token");
    localStorage.removeItem("saepsaude_usuario");
    setUsuario(null);
  }

  const value = useMemo(
    () => ({
      usuario,
      logado: Boolean(usuario),
      login,
      logout
    }),
    [usuario]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}