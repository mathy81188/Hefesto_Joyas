import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export function Ruta({ children, rolRequerido }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (rolRequerido && usuario.rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  return children;
}