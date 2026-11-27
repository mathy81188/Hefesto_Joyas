import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Login.css";

export function Login() {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, registrar } = useAuth();
  const navigate = useNavigate();

  function cambiarModo(esRegistro) {
    setModoRegistro(esRegistro);
    setError("");
    setNombre("");
    setEmail("");
    setPassword("");
  }

  function autocompletarDemo(rol) {
    setModoRegistro(false);
    setError("");

    if (rol === "admin") {
      setEmail("admin@hefesto.com");
      setPassword("admin123");
    } else {
      setEmail("cliente@hefesto.com");
      setPassword("cliente123");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Completá todos los campos obligatorios.");
      return;
    }

    if (modoRegistro && !nombre.trim()) {
      setError("Ingresá tu nombre completo para registrarte.");
      return;
    }

    try {
      let sesion;

      if (modoRegistro) {
        sesion = await registrar(nombre, email, password);
      } else {
        sesion = await login(email, password);
      }

      if (sesion.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-tabs">
          <button
            type="button"
            className={!modoRegistro ? "tab-btn active" : "tab-btn"}
            onClick={() => cambiarModo(false)}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={modoRegistro ? "tab-btn active" : "tab-btn"}
            onClick={() => cambiarModo(true)}
          >
            Crear Cuenta
          </button>
        </div>

        <h2 className="login-title">
          {modoRegistro ? "Unite a Hefesto Joyas" : "Bienvenido al Taller"}
        </h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          {modoRegistro && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej. Laura Gómez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-submit">
            {modoRegistro ? "Registrarme" : "Ingresar"}
          </button>
        </form>

        {!modoRegistro && (
          <div className="demo-access">
            <p className="demo-label">Accesos rápidos para prueba:</p>
            <div className="demo-buttons">
              <button
                type="button"
                className="btn-demo"
                onClick={() => autocompletarDemo("admin")}
              >
                Cargar Admin
              </button>
              <button
                type="button"
                className="btn-demo"
                onClick={() => autocompletarDemo("cliente")}
              >
                Cargar Cliente
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}