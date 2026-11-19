import { hashearPassword } from "../utils/hashPassword";

const USERS_KEY = "hefesto_usuarios";
const SESSION_KEY = "hefesto_sesion";

export async function loginUsuario(email, password) {
  const usuarios = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const passwordHasheada = await hashearPassword(password);

  const usuarioValido = usuarios.find(
    (u) => u.email === email && u.password === passwordHasheada
  );

  if (!usuarioValido) {
    throw new Error("Email o contraseña incorrectos");
  }

  // Guarda datos de sesion
  const datosSesion = {
    id: usuarioValido.id,
    nombre: usuarioValido.nombre,
    email: usuarioValido.email,
    rol: usuarioValido.rol,
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(datosSesion));
  return datosSesion;
}

export function obtenerSesionActual() {
  const sesion = sessionStorage.getItem(SESSION_KEY);
  if (!sesion) {
    return null;
  }
  return JSON.parse(sesion);
}

export function cerrarSesion() {
  sessionStorage.removeItem(SESSION_KEY);
}