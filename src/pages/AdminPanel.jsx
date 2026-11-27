import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { obtenerJoyas, guardarJoyas } from "../services/joyasService";
import {
  obtenerUsuarios,
  crearUsuarioAdmin,
  cambiarRolUsuario,
  eliminarUsuario,
} from "../services/usuariosService";
import {
  obtenerPedidos,
  actualizarEstadoPedido,
} from "../services/pedidosService";
import { AlertModal } from "../components/AlertModal";
import { JoyaForm } from "../components/admin/JoyaForm";
import { JoyasTabla } from "../components/admin/JoyasTabla";
import { PedidosGestion } from "../components/admin/PedidosGestion";
import { UsuariosGestion } from "../components/admin/UsuariosGestion";
import "./AdminPanel.css";

const IMAGEN_POR_DEFECTO =
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80";

export function AdminPanel() {
  const { usuario: adminActual } = useAuth();
  const [tabActiva, setTabActiva] = useState("joyas");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [joyas, setJoyas] = useState(() => obtenerJoyas());
  const [usuarios, setUsuarios] = useState(() => obtenerUsuarios());
  const [pedidos, setPedidos] = useState(() => obtenerPedidos());
  const [joyaEditando, setJoyaEditando] = useState(null);

  function mostrarAviso(texto) {
    setError("");
    setMensaje(texto);
  }

  function handleGuardarJoya(datosJoya) {
    setError("");
    const urlImagenFinal =
      datosJoya.imagen !== "" ? datosJoya.imagen : IMAGEN_POR_DEFECTO;

    if (joyaEditando) {
      const actualizadas = joyas.map((j) => {
        if (j.id === joyaEditando.id) {
          return {
            ...j,
            ...datosJoya,
            imagen: urlImagenFinal,
          };
        }
        return j;
      });

      guardarJoyas(actualizadas);
      setJoyas(actualizadas);
      setJoyaEditando(null);
      mostrarAviso("Pieza actualizada en el catálogo.");
    } else {
      const nuevaJoya = {
        id: Date.now(),
        ...datosJoya,
        descripcion:
          datosJoya.descripcion || "Pieza artesanal forjada en taller.",
        imagen: urlImagenFinal,
      };

      const actualizadas = [nuevaJoya, ...joyas];
      guardarJoyas(actualizadas);
      setJoyas(actualizadas);
      mostrarAviso("Nueva joya agregada al catálogo.");
    }
  }

  function handleEliminarJoya(id) {
    const filtradas = joyas.filter((j) => j.id !== id);
    guardarJoyas(filtradas);
    setJoyas(filtradas);

    if (joyaEditando && joyaEditando.id === id) {
      setJoyaEditando(null);
    }
    mostrarAviso("Joya eliminada del catálogo.");
  }

  async function handleCrearUsuario({ nombre, email, password, rol }) {
    setError("");
    try {
      const actualizados = await crearUsuarioAdmin(nombre, email, password, rol);
      setUsuarios(actualizados);
      mostrarAviso("Usuario creado correctamente.");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  function handleCambioRol(id, nuevoRol) {
    const actualizados = cambiarRolUsuario(id, nuevoRol);
    setUsuarios(actualizados);
    mostrarAviso("Rol de usuario actualizado.");
  }

  function handleEliminarUsuario(id) {
    if (id === adminActual.id) {
      setError("No podés eliminar tu propia cuenta mientras estás logueado.");
      return;
    }
    const actualizados = eliminarUsuario(id);
    setUsuarios(actualizados);
    mostrarAviso("Usuario eliminado.");
  }

  function handleEstadoPedido(pedidoId, nuevoEstado) {
    const actualizados = actualizarEstadoPedido(pedidoId, nuevoEstado);
    setPedidos(actualizados);
    mostrarAviso(
      `Estado del pedido #${pedidoId} actualizado a "${nuevoEstado}".`,
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-header">
        <h2>Panel de Administración — Hefesto Joyas</h2>
        <p>
          Gestión integral de inventario, cuentas de usuario y órdenes del
          taller.
        </p>
      </div>

      <div className="admin-tabs">
        <button
          type="button"
          className={tabActiva === "joyas" ? "admin-tab active" : "admin-tab"}
          onClick={() => setTabActiva("joyas")}
        >
          Catálogo de Joyas ({joyas.length})
        </button>
        <button
          type="button"
          className={tabActiva === "pedidos" ? "admin-tab active" : "admin-tab"}
          onClick={() => setTabActiva("pedidos")}
        >
          Pedidos y Taller ({pedidos.length})
        </button>
        <button
          type="button"
          className={
            tabActiva === "usuarios" ? "admin-tab active" : "admin-tab"
          }
          onClick={() => setTabActiva("usuarios")}
        >
          Usuarios ({usuarios.length})
        </button>
      </div>

      <AlertModal
        mensaje={mensaje}
        tipo="exito"
        onCerrar={() => setMensaje("")}
      />
      <AlertModal mensaje={error} tipo="error" onCerrar={() => setError("")} />

      {tabActiva === "joyas" && (
        <div className="admin-split">
          <JoyaForm
            key={joyaEditando ? joyaEditando.id : "nueva"}
            joyaEditando={joyaEditando}
            onGuardarJoya={handleGuardarJoya}
            onCancelarEdicion={() => setJoyaEditando(null)}
            onError={(msg) => setError(msg)}
          />
          <JoyasTabla
            joyas={joyas}
            onEditar={(joya) => setJoyaEditando(joya)}
            onEliminar={handleEliminarJoya}
          />
        </div>
      )}

      {tabActiva === "pedidos" && (
        <PedidosGestion
          pedidos={pedidos}
          onCambiarEstado={handleEstadoPedido}
        />
      )}

      {tabActiva === "usuarios" && (
        <UsuariosGestion
          usuarios={usuarios}
          adminActualId={adminActual.id}
          onCrearUsuario={handleCrearUsuario}
          onCambiarRol={handleCambioRol}
          onEliminarUsuario={handleEliminarUsuario}
          onError={(msg) => setError(msg)}
        />
      )}
    </section>
  );
}