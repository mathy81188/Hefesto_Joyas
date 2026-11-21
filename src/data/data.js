import { hashearPassword } from "../utils/hashPassword";
// data temporal hasta aplicar backend

import joyasIniciales from "./joyas.json";
import pedidosIniciales from "./pedidos.json";

const USERS_KEY = "hefesto_usuarios";
const JOYAS_KEY = "hefesto_joyas";
const PEDIDOS_KEY = "hefesto_pedidos";

export async function inicializarDatos() {

  if (!localStorage.getItem(JOYAS_KEY)) {
    localStorage.setItem(JOYAS_KEY, JSON.stringify(joyasIniciales));
  }
  if (!localStorage.getItem(PEDIDOS_KEY)) {
    localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidosIniciales));
  }

  if (!localStorage.getItem(USERS_KEY)) {
    const adminPassword = await hashearPassword("admin123");
    const clientePassword = await hashearPassword("cliente123");

    const usuariosIniciales = [
      {
        id: 1,
        nombre: "Maestro Hefesto (Admin)",
        email: "admin@hefesto.com",
        password: adminPassword,
        rol: "admin",
      },
      {
        id: 2,
        nombre: "Matias Cliente",
        email: "cliente@hefesto.com",
        password: clientePassword,
        rol: "cliente",
      },
    ];

    localStorage.setItem(USERS_KEY, JSON.stringify(usuariosIniciales));
  }

}
