import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import {
  obtenerPedidos,
  crearPedido,
  eliminarPedido,
} from "../../services/pedidosService";
import { obtenerJoyas, guardarJoyas } from "../../services/joyasService";
import { AlertModal } from "../AlertModal";
import tarifasTaller from "../../data/tarifasTaller.json";
import "./ClientePanel.css";

export function ClientePanel() {
  const { usuario } = useAuth();

  const [misPedidos, setMisPedidos] = useState(() => {
    const todos = obtenerPedidos();
    return todos.filter((p) => p.usuarioId === usuario.id);
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tipoPieza, setTipoPieza] = useState("Anillo");
  const [material, setMaterial] = useState("Plata 925");
  const [piedra, setPiedra] = useState("Sin piedra");
  const [grabado, setGrabado] = useState("");
  const [mensaje, setMensaje] = useState("");

  function calcularPresupuesto() {
    const base = tarifasTaller.preciosBase[material] || 0;
    const adicionalPiedra = tarifasTaller.extraPiedra[piedra] || 0;
    let adicionalGrabado = 0;

    if (grabado.trim() !== "") {
      adicionalGrabado = tarifasTaller.extraGrabado;
    }

    return base + adicionalPiedra + adicionalGrabado;
  }

  function handleCrearEncargo(e) {
    e.preventDefault();

    const textoGrabado =
      grabado.trim() !== "" ? ` | Grabado: "${grabado.trim()}"` : "";
    const detalleCompleto = `${tipoPieza} en ${material} (${piedra})${textoGrabado}`;

    const nuevoEncargo = {
      id: Date.now(),
      usuarioId: usuario.id,
      clienteNombre: usuario.nombre,
      tipo: "Encargo a medida",
      detalle: detalleCompleto,
      fecha: new Date().toISOString().split("T")[0],
      total: calcularPresupuesto(),
      estado: "Pendiente",
    };

    crearPedido(nuevoEncargo);
    setMisPedidos([nuevoEncargo, ...misPedidos]);

    setGrabado("");
    setMostrarFormulario(false);
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

  function obtenerClaseEstado(estado) {
    if (estado === "Listo para retirar") {
      return "estado-badge listo";
    }
    if (estado === "En forja") {
      return "estado-badge forja";
    }
    return "estado-badge pendiente";
  }

  function toggleFormulario() {
    if (mostrarFormulario) {
      setMostrarFormulario(false);
    } else {
      setMostrarFormulario(true);
    }
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
        {/* Bloque 1 (Principal): Historial de Pedidos y Encargos */}
        <div className="pedidos-card">
          <h3>Mis Pedidos y Encargos ({misPedidos.length})</h3>

          {misPedidos.length === 0 ? (
            <p className="sin-pedidos">
              Todavía no realizaste compras ni encargos. Explorá el catálogo o diseñá tu pieza más abajo.
            </p>
          ) : (
            <div className="pedidos-lista">
              {misPedidos.map((pedido) => (
                <article key={pedido.id} className="pedido-item">
                  <div className="pedido-top">
                    <span className="pedido-tipo">{pedido.tipo}</span>
                    <span className={obtenerClaseEstado(pedido.estado)}>
                      {pedido.estado}
                    </span>
                  </div>

                  <p className="pedido-detalle">{pedido.detalle}</p>

                  <div className="pedido-bottom">
                    <span className="pedido-fecha">Fecha: {pedido.fecha}</span>

                    <div className="pedido-acciones">
                      <strong className="pedido-total">
                        ${pedido.total.toLocaleString("es-AR")}
                      </strong>

                      {pedido.estado === "Pendiente" && (
                        <button
                          type="button"
                          className="btn-cancelar-pedido"
                          onClick={() => handleEliminarPedido(pedido)}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Bloque 2 (Secundario desplegable): Encargo a Medida */}
        <div className="encargo-card">
          <div className="encargo-toggle-header" onClick={toggleFormulario}>
            <div>
              <h3>Solicitar Joya a Medida (Diseño desde cero)</h3>
              <p className="encargo-subtitulo">
                ¿Buscás una pieza única que no está en el catálogo? Cotizala y encargala al orfebre.
              </p>
            </div>

            <button type="button" className="btn-toggle-encargo">
              {mostrarFormulario ? "Ocultar formulario ▲" : "Diseñar pieza ▼"}
            </button>
          </div>

          {mostrarFormulario && (
            <form onSubmit={handleCrearEncargo} className="encargo-form encargo-form-abierto">
              <div className="encargo-campos-grid">
                <div className="form-group">
                  <label htmlFor="tipo-pieza">Tipo de pieza</label>
                  <select
                    id="tipo-pieza"
                    value={tipoPieza}
                    onChange={(e) => setTipoPieza(e.target.value)}
                  >
                    <option value="Anillo">Anillo</option>
                    <option value="Collar">Collar</option>
                    <option value="Pulsera">Pulsera</option>
                    <option value="Aros">Aros</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="material-pieza">Metal principal</label>
                  <select
                    id="material-pieza"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  >
                    <option value="Plata 925">Plata 925 ($65.000 base)</option>
                    <option value="Oro 18k">Oro 18k ($130.000 base)</option>
                    <option value="Bronce">Bronce ($45.000 base)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="piedra-pieza">Engarce de piedra</label>
                  <select
                    id="piedra-pieza"
                    value={piedra}
                    onChange={(e) => setPiedra(e.target.value)}
                  >
                    <option value="Sin piedra">Sin piedra ($0)</option>
                    <option value="Obsidiana">Obsidiana (+$15.000)</option>
                    <option value="Granate">Granate (+$22.000)</option>
                    <option value="Esmeralda">Esmeralda (+$35.000)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="grabado-pieza">
                    Grabado personalizado (opcional, +$8.000)
                  </label>
                  <input
                    id="grabado-pieza"
                    type="text"
                    maxLength={25}
                    placeholder="Ej. Iniciales o fecha"
                    value={grabado}
                    onChange={(e) => setGrabado(e.target.value)}
                  />
                </div>
              </div>

              <div className="presupuesto-box">
                <span>Presupuesto estimado:</span>
                <strong>${calcularPresupuesto().toLocaleString("es-AR")}</strong>
              </div>

              <button type="submit" className="btn-encargar">
                Enviar Encargo al Taller
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}