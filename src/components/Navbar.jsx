import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Navbar.css";

export function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function renderEnlacesPorRol() {
    if (!usuario) {
      return (
        <NavLink to="/login" className="nav-btn-login">
          Ingresar
        </NavLink>
      );
    }

    if (usuario.rol === "admin") {
      return (
        <>
          <NavLink to="/admin" className="nav-link">
            Panel Admin
          </NavLink>
          <span className="nav-user-badge">Admin: {usuario.nombre}</span>
          <button type="button" onClick={handleLogout} className="nav-btn-logout">
            Cerrar sesión
          </button>
        </>
      );
    }

    return (
      <>
        <NavLink to="/cliente" className="nav-link">
          Mis Pedidos y Encargos
        </NavLink>
        <span className="nav-user-badge">{usuario.nombre}</span>
        <button type="button" onClick={handleLogout} className="nav-btn-logout">
          Cerrar sesión
        </button>
      </>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <img
              src="./public/logo-hefesto.svg"
              alt="Hefesto Joyas"
              className="navbar-logo-img"
            />
        </Link>

        <div className="navbar-links">
          <NavLink to="/" end className="nav-link">
            Catálogo
          </NavLink>

          {renderEnlacesPorRol()}
        </div>
      </div>
    </nav>
  );
}