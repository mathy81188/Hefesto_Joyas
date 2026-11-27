export function JoyasTabla({ joyas, onEditar, onEliminar }) {
  return (
    <div className="admin-card">
      <h3>Inventario Actual</h3>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pieza</th>
              <th>Material</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {joyas.map((joya) => (
              <tr key={joya.id}>
                <td>
                  <strong>{joya.nombre}</strong>
                  <span className="subtext">{joya.categoria}</span>
                </td>
                <td>{joya.material}</td>
                <td>${joya.precio.toLocaleString("es-AR")}</td>
                <td>{joya.stock} u.</td>
                <td className="td-actions">
                  <button
                    type="button"
                    className="btn-table-edit"
                    onClick={() => onEditar(joya)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn-table-del"
                    onClick={() => onEliminar(joya.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}