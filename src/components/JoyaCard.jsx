import "./JoyaCard.css";

export function JoyaCard({ joya, usuario, onComprar }) {
  const sinStock = joya.stock <= 0;

  function renderBotonAccion() {
    if (usuario && usuario.rol === "admin") {
      return <span className="joya-admin-hint">Gestionar desde Panel Admin</span>;
    }

    if (sinStock) {
      return (
        <button type="button" className="btn-joya disabled" disabled>
          Sin stock
        </button>
      );
    }

    return (
      <button
        type="button"
        className="btn-joya"
        onClick={() => onComprar(joya)}
      >
        {usuario ? "Solicitar pieza" : "Ingresar para comprar"}
      </button>
    );
  }

  return (
    <article className="joya-card">
      <div className="joya-img-wrapper">
        <img src={joya.imagen} alt={joya.nombre} className="joya-img" />
        <span className="joya-badge">{joya.material}</span>
      </div>

      <div className="joya-body">
        <span className="joya-categoria">{joya.categoria}</span>
        <h3 className="joya-nombre">{joya.nombre}</h3>
        <p className="joya-desc">{joya.descripcion}</p>

        <div className="joya-footer">
          <div className="joya-meta">
            <span className="joya-precio">
              ${joya.precio.toLocaleString("es-AR")}
            </span>
            <span className="joya-stock">Disponibles: {joya.stock}</span>
          </div>

          {renderBotonAccion()}
        </div>
      </div>
    </article>
  );
}