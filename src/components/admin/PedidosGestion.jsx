export function PedidosGestion({ pedidos, onCambiarEstado }) {
  return (
    <div className="admin-card">
      <h3>Órdenes de Compra y Encargos a Medida</h3>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID / Fecha</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Detalle</th>
              <th>Total</th>
              <th>Estado en Taller</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>
                  <strong>#{pedido.id}</strong>
                  <span className="subtext">{pedido.fecha}</span>
                </td>
                <td>{pedido.clienteNombre}</td>
                <td>{pedido.tipo}</td>
                <td>{pedido.detalle}</td>
                <td>${pedido.total.toLocaleString("es-AR")}</td>
                <td>
                  <select
                    className="select-estado"
                    value={pedido.estado}
                    onChange={(e) => onCambiarEstado(pedido.id, e.target.value)}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En forja">En forja</option>
                    <option value="Listo para retirar">
                      Listo para retirar
                    </option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}