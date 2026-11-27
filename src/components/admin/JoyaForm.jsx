import { useState } from "react";

export function JoyaForm({ joyaEditando, onGuardarJoya, onCancelarEdicion, onError }) {
  const [nombre, setNombre] = useState(joyaEditando ? joyaEditando.nombre : "");
  const [categoria, setCategoria] = useState(joyaEditando ? joyaEditando.categoria : "Anillos");
  const [material, setMaterial] = useState(joyaEditando ? joyaEditando.material : "Oro 18k");
  const [precio, setPrecio] = useState(joyaEditando ? String(joyaEditando.precio) : "");
  const [stock, setStock] = useState(joyaEditando ? String(joyaEditando.stock) : "");
  const [descripcion, setDescripcion] = useState(joyaEditando ? joyaEditando.descripcion : "");
  const [imagen, setImagen] = useState(joyaEditando ? joyaEditando.imagen : "");

  function limpiarCampos() {
    setNombre("");
    setCategoria("Anillos");
    setMaterial("Oro 18k");
    setPrecio("");
    setStock("");
    setDescripcion("");
    setImagen("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!nombre.trim() || !precio || !stock) {
      onError("Completá nombre, precio y stock de la pieza.");
      return;
    }

    onGuardarJoya({
      nombre: nombre.trim(),
      categoria,
      material,
      precio: Number(precio),
      stock: Number(stock),
      descripcion: descripcion.trim(),
      imagen: imagen.trim(),
    });

    limpiarCampos();
  }

  function handleCancelar() {
    limpiarCampos();
    onCancelarEdicion();
  }

  return (
    <div className="admin-card">
      <h3>{joyaEditando ? "Editar Joya" : "Agregar Nueva Joya"}</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="j-nombre">Nombre de la pieza</label>
          <input
            id="j-nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Anillo Corona Solar"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="j-cat">Categoría</label>
            <select
              id="j-cat"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="Anillos">Anillos</option>
              <option value="Collares">Collares</option>
              <option value="Aros">Aros</option>
              <option value="Pulseras">Pulseras</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="j-mat">Material</label>
            <select
              id="j-mat"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              <option value="Oro 18k">Oro 18k</option>
              <option value="Plata 925">Plata 925</option>
              <option value="Bronce">Bronce</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="j-precio">Precio ($ ARS)</label>
            <input
              id="j-precio"
              type="number"
              min="1"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="j-stock">Stock</label>
            <input
              id="j-stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="j-img">URL de imagen (opcional)</label>
          <input
            id="j-img"
            type="url"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="j-desc">Descripción</label>
          <input
            id="j-desc"
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Detalles del acabado o piedra..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {joyaEditando ? "Guardar Cambios" : "Crear Joya"}
          </button>
          {joyaEditando && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancelar}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}