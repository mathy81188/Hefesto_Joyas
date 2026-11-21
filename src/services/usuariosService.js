import { hashearPassword } from "../utils/hashPassword";

const USERS_KEY = "hefesto_usuarios";

export function obtenerUsuarios() {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    return [];
  }
  return JSON.parse(data);
}

export async function crearUsuarioAdmin(nombre, email, password, rol) {
  const usuarios = obtenerUsuarios();
  const existe = usuarios.some(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (existe) {
    throw new Error("Ya existe un usuario con ese correo electrónico.");
  }

  const passwordHasheada = await hashearPassword(password);

  const nuevoUsuario = {
    id: Date.now(),
    nombre: nombre.trim(),
    email: email.trim().toLowerCase(),
    password: passwordHasheada,
    rol: rol,
  };

  const actualizados = [...usuarios, nuevoUsuario];
  localStorage.setItem(USERS_KEY, JSON.stringify(actualizados));
  return actualizados;
}

export function cambiarRolUsuario(usuarioId, nuevoRol) {
  const usuarios = obtenerUsuarios();
  const actualizados = usuarios.map((u) => {
    if (u.id === usuarioId) {
      return { ...u, rol: nuevoRol };
    }
    return u;
  });
  localStorage.setItem(USERS_KEY, JSON.stringify(actualizados));
  return actualizados;
}

export function eliminarUsuario(usuarioId) {
  const usuarios = obtenerUsuarios();
  const actualizados = usuarios.filter((u) => u.id !== usuarioId);
  localStorage.setItem(USERS_KEY, JSON.stringify(actualizados));
  return actualizados;
}