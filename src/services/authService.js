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

  const datosSesion = {
    id: usuarioValido.id,
    nombre: usuarioValido.nombre,
    email: usuarioValido.email,
    rol: usuarioValido.rol,
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(datosSesion));
  return datosSesion;
}

export async function registrarUsuario(nombre, email, password) {
  const usuarios = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const existeEmail = usuarios.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (existeEmail) {
    throw new Error("Ya existe una cuenta registrada con ese email");
  }

  const passwordHasheada = await hashearPassword(password);

  const nuevoUsuario = {
    id: Date.now(),
    nombre: nombre.trim(),
    email: email.trim().toLowerCase(),
    password: passwordHasheada,
    rol: "cliente",
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));

  const datosSesion = {
    id: nuevoUsuario.id,
    nombre: nuevoUsuario.nombre,
    email: nuevoUsuario.email,
    rol: nuevoUsuario.rol,
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
  localStorage.removeItem(SESSION_KEY);
}