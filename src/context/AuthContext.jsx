import { useState, useEffect } from "react";
import { loginUsuario, obtenerSesionActual, cerrarSesion } from "../services/authService";
import { inicializarDatos } from "../data/seedData";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function arrancarApp() {
      await inicializarDatos();
      const sesionGuardada = obtenerSesionActual();
      if (sesionGuardada) {
        setUsuario(sesionGuardada);
      }
      setCargando(false);
    }

    arrancarApp();
  }, []);

  async function login(email, password) {
    const datosSesion = await loginUsuario(email, password);
    setUsuario(datosSesion);
    return datosSesion;
  }

  function logout() {
    cerrarSesion();
    setUsuario(null);
  }

  if (cargando) {
    return <div style={{ color: "#D4AF37", padding: "2rem" }}>Encendiendo la forja...</div>;
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}