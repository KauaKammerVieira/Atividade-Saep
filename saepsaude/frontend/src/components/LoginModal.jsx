import React,{ useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!email || !senha) {
      setError("E-mail e senha são obrigatórios.");
      return;
    }

    try {
      await login(email, senha);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao realizar login.");
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="login-modal" onMouseDown={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Fechar">
          <X />
        </button>

        <h2>Login</h2>

        <form onSubmit={submit}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <label htmlFor="login-senha">Senha</label>
          <input
            id="login-senha"
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="submit" className="primary-btn">Login</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
