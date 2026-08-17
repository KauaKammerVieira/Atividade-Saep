import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Activities from "./pages/Activities.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import LoginModal from "./components/LoginModal.jsx";

function Protected({ children }) {
  const { logado } = useAuth();
  return logado ? children : <Navigate to="/" replace />;
}

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home onLogin={() => setLoginOpen(true)} />} />
        <Route
          path="/atividades"
          element={
            <Protected>
              <Activities onLogin={() => setLoginOpen(true)} />
            </Protected>
          }
        />
      </Routes>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
