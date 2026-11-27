import { useState } from "react";
import tarifasTaller from "../../data/tarifasTaller.json";

export function EncargoMedidaForm({ onCrearEncargo }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tipoPieza, setTipoPieza] = useState("Anillo");
  const [material, setMaterial] = useState("Plata 925");
  const [piedra, setPiedra] = useState("Sin piedra");
  const [grabado, setGrabado] = useState("");

  function calcularPresupuesto() {
    const base = tarifasTaller.preciosBase[material] || 0;
    const adicionalPiedra = tarifasTaller.extraPiedra[piedra] || 0;
    let adicionalGrabado = 0;

    if (grabado.trim() !== "") {
      adicionalGrabado = tarifasTaller.extraGrabado;
    }

    return base + adicionalPiedra + adicionalGrabado;
  }

  function toggleFormulario() {
    if (mostrarFormulario) {
      setMostrarFormulario(false);
    } else {
      setMostrarFormulario(true);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const textoGrabado =
      grabado.trim() !== "" ? ` | Grabado: "${grabado.trim()}"` : "";
    const detalleCompleto = `${tipoPieza} en ${material} (${piedra})${textoGrabado}`;

    onCrearEncargo({
      detalle: detalleCompleto,
      total: calcularPresupuesto(),
    });

    setGrabado("");
    setMostrarFormulario(false);
  }

  return (
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
        <form onSubmit={handleSubmit} className="encargo-form encargo-form-abierto">
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
  );
}