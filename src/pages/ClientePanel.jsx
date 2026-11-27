import { useState } from "react";
import { useAuth } from "../context/useAuth";
import {
  obtenerPedidos,
  crearPedido,
  eliminarPedido,
} from "../services/pedidosService";
import { obtenerJoyas, guardarJoyas } from "../services/joyasService";
import { AlertModal } from "../components/AlertModal";
import { ListaPedidosCliente } from "../components/cliente/ListaPedidosCliente";
import { EncargoMedidaForm } from "../components/cliente/EncargoMedidaForm";
import "./ClientePanel.css";

export function ClientePanel() {
  const { usuario } = useAuth();

  const [misPedidos, setMisPedidos] = useState(() => {
    const todos = obtenerPedidos();
    return todos.filter((p) => p.usuarioId === usuario.id);
  });

  const [mensaje, setMensaje] = useState("");

  function handleCrearEncargo({ detalle, total }) {
    const nuevoEncargo = {
      id: Date.now(),
      usuarioId: usuario.id,
      clienteNombre: usuario.nombre,
      tipo: "Encargo a medida",
      detalle,
      fecha: new Date().toISOString().split("T")[0],
      total,
      estado: "Pendiente",
    };

    crearPedido(nuevoEncargo);
    setMisPedidos([nuevoEncargo, ...misPedidos]);
    setMensaje("Tu solicitud de pieza a medida ingresó al taller.");
  }

  function handleEliminarPedido(pedidoAEliminar) {
    if (pedidoAEliminar.tipo === "Compra de catálogo") {
      const unidadesADevolver = pedidoAEliminar.cantidad || 1;
      const joyasActuales = obtenerJoyas();

      const joyasRestauradas = joyasActuales.map((joya) => {
        if (pedidoAEliminar.detalle.startsWith(joya.nombre)) {
          return { ...joya, stock: joya.stock + unidadesADevolver };
        }
        return joya;
      });

      guardarJoyas(joyasRestauradas);
    }

    eliminarPedido(pedidoAEliminar.id);
    const filtrados = misPedidos.filter((p) => p.id !== pedidoAEliminar.id);
    setMisPedidos(filtrados);
    setMensaje("El pedido fue cancelado y el stock fue restaurado.");
  }

  return (
    <section className="cliente-page">
      <div className="cliente-header">
        <h2>Taller Personal de {usuario.nombre}</h2>
        <p>Seguí el estado de tus compras o encargá una pieza forjada desde cero.</p>
      </div>

      <AlertModal
        mensaje={mensaje}
        tipo="exito"
        onCerrar={() => setMensaje("")}
      />

      <div className="cliente-stack">
        <ListaPedidosCliente
          pedidos={misPedidos}
          onCancelarPedido={handleEliminarPedido}
        />

        <EncargoMedidaForm onCrearEncargo={handleCrearEncargo} />
      </div>
    </section>
  );
}