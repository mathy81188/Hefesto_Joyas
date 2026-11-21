import "./AlertModal.css";

export function AlertModal({ mensaje, tipo = "exito", onCerrar }) {
  if (!mensaje) {
    return null;
  }

  const esError = tipo === "error";

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={esError ? "modal-icon error" : "modal-icon exito"}>
          {esError ? "!" : "✓"}
        </div>

        <h3 className="modal-title">
          {esError ? "Atención" : "¡Operación exitosa!"}
        </h3>

        <p className="modal-message">{mensaje}</p>

        <button type="button" className="modal-btn" onClick={onCerrar}>
          Entendido
        </button>
      </div>
    </div>
  );
}