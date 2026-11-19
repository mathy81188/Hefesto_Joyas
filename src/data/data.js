import { hashearPassword } from "../utils/hashPassword";
// data temporal hasta aplicar backend

const USERS_KEY = "hefesto_usuarios";
const JOYAS_KEY = "hefesto_joyas";
const PEDIDOS_KEY = "hefesto_pedidos";

export async function inicializarDatos() {
  
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

  // Catalogo de Joyas temporal
  if (!localStorage.getItem(JOYAS_KEY)) {
    const joyasIniciales = [
      {
        id: 101,
        nombre: "Anillo Forja de Vulcano",
        categoria: "Anillos",
        material: "Oro 18k",
        precio: 145000,
        stock: 5,
        descripcion: "Anillo macizo texturado a mano con acabado satinado.",
        imagen: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: 102,
        nombre: "Collar Lágrima de Obsidiana",
        categoria: "Collares",
        material: "Plata 925",
        precio: 68000,
        stock: 8,
        descripcion: "Cadena de plata envejecida con dije de piedra volcánica natural.",
        imagen: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: 103,
        nombre: "Aros Brasas del Olimpo",
        categoria: "Aros",
        material: "Oro 18k",
        precio: 92000,
        stock: 3,
        descripcion: "Aros colgantes con engarce de granate rojo intenso.",
        imagen: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
      },
      {
        id: 104,
        nombre: "Pulsera Eslabones de Hierro",
        categoria: "Pulseras",
        material: "Plata 925",
        precio: 75000,
        stock: 10,
        descripcion: "Pulsera robusta de eslabones forjados con cierre de seguridad.",
        imagen: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80",
      },
    ];

    localStorage.setItem(JOYAS_KEY, JSON.stringify(joyasIniciales));
  }

  // 3. Inicializar Pedidos / Encargos a medida (para que el Admin ya vea movimiento)
  if (!localStorage.getItem(PEDIDOS_KEY)) {
    const pedidosIniciales = [
      {
        id: 5001,
        usuarioId: 2,
        clienteNombre: "Matías Cliente",
        tipo: "Encargo a medida",
        detalle: "Alianza en Plata 925 con grabado interior '8/11'",
        fecha: "2026-11-18",
        total: 85000,
        estado: "En forja", // Pendiente | En forja | Listo para retirar
      },
    ];

    localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidosIniciales));
  }
}