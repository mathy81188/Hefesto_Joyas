import { useState, useEffect } from "react";
import {
  loginUsuario,
  registrarUsuario,
  obtenerSesionActual,
  cerrarSesion,
} from "../services/authService";
import { inicializarDatos } from "../data/data";
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

  async function registrar(nombre, email, password) {
    const datosSesion = await registrarUsuario(nombre, email, password);
    setUsuario(datosSesion);
    return datosSesion;
  }

  function logout() {
    cerrarSesion();
    setUsuario(null);
  }

  if (cargando) {
    return <div className="loading-forja">Encendiendo la forja...</div>;
  }

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}