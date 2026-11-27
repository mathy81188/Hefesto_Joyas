export function ListaPedidosCliente({ pedidos, onCancelarPedido }) {
  function obtenerClaseEstado(estado) {
    if (estado === "Listo para retirar") {
      return "estado-badge listo";
    }
    if (estado === "En forja") {
      return "estado-badge forja";
    }
    return "estado-badge pendiente";
  }

  return (
    <div className="pedidos-card">
      <h3>Mis Pedidos y Encargos ({pedidos.length})</h3>

      {pedidos.length === 0 ? (
        <p className="sin-pedidos">
          Todavía no realizaste compras ni encargos. Explorá el catálogo o diseñá tu pieza más abajo.
        </p>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido) => (
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
                      onClick={() => onCancelarPedido(pedido)}
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
  );
}