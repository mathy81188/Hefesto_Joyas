import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { obtenerJoyas, guardarJoyas } from "../../services/joyasService";
import {
  obtenerUsuarios,
  crearUsuarioAdmin,
  cambiarRolUsuario,
  eliminarUsuario,
} from "../../services/usuariosService";
import {
  obtenerPedidos,
  actualizarEstadoPedido,
} from "../../services/pedidosService";
import { AlertModal } from "../AlertModal";
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

  const [joyaEditandoId, setJoyaEditandoId] = useState(null);
  const [nombreJoya, setNombreJoya] = useState("");
  const [categoriaJoya, setCategoriaJoya] = useState("Anillos");
  const [materialJoya, setMaterialJoya] = useState("Oro 18k");
  const [precioJoya, setPrecioJoya] = useState("");
  const [stockJoya, setStockJoya] = useState("");
  const [descripcionJoya, setDescripcionJoya] = useState("");
  const [imagenJoya, setImagenJoya] = useState("");

  //  useS formulario Alta
  const [nombreUser, setNombreUser] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [passwordUser, setPasswordUser] = useState("");
  const [rolUser, setRolUser] = useState("cliente");

  function mostrarAviso(texto) {
    setError("");
    setMensaje(texto);
  }

  //handlers
  function limpiarFormJoya() {
    setJoyaEditandoId(null);
    setNombreJoya("");
    setCategoriaJoya("Anillos");
    setMaterialJoya("Oro 18k");
    setPrecioJoya("");
    setStockJoya("");
    setDescripcionJoya("");
    setImagenJoya("");
  }

  function cargarJoyaParaEditar(joya) {
    setJoyaEditandoId(joya.id);
    setNombreJoya(joya.nombre);
    setCategoriaJoya(joya.categoria);
    setMaterialJoya(joya.material);
    setPrecioJoya(String(joya.precio));
    setStockJoya(String(joya.stock));
    setDescripcionJoya(joya.descripcion);
    setImagenJoya(joya.imagen);
  }

  function handleGuardarJoya(e) {
    e.preventDefault();
    setError("");

    if (!nombreJoya.trim() || !precioJoya || !stockJoya) {
      setError("Completá nombre, precio y stock de la pieza.");
      return;
    }

    const urlImagenFinal =
      imagenJoya.trim() !== "" ? imagenJoya.trim() : IMAGEN_POR_DEFECTO;

    if (joyaEditandoId) {
      const actualizadas = joyas.map((j) => {
        if (j.id === joyaEditandoId) {
          return {
            ...j,
            nombre: nombreJoya.trim(),
            categoria: categoriaJoya,
            material: materialJoya,
            precio: Number(precioJoya),
            stock: Number(stockJoya),
            descripcion: descripcionJoya.trim(),
            imagen: urlImagenFinal,
          };
        }
        return j;
      });

      guardarJoyas(actualizadas);
      setJoyas(actualizadas);
      mostrarAviso("Pieza actualizada en el catálogo.");
    } else {
      const nuevaJoya = {
        id: Date.now(),
        nombre: nombreJoya.trim(),
        categoria: categoriaJoya,
        material: materialJoya,
        precio: Number(precioJoya),
        stock: Number(stockJoya),
        descripcion:
          descripcionJoya.trim() || "Pieza artesanal forjada en taller.",
        imagen: urlImagenFinal,
      };

      const actualizadas = [nuevaJoya, ...joyas];
      guardarJoyas(actualizadas);
      setJoyas(actualizadas);
      mostrarAviso("Nueva joya agregada al catálogo");
    }

    limpiarFormJoya();
  }

  function handleEliminarJoya(id) {
    const filtradas = joyas.filter((j) => j.id !== id);
    guardarJoyas(filtradas);
    setJoyas(filtradas);
    if (joyaEditandoId === id) {
      limpiarFormJoya();
    }
    mostrarAviso("Joya eliminada del catálogo.");
  }

  // handlers users
  async function handleCrearUsuario(e) {
    e.preventDefault();
    setError("");

    if (!nombreUser.trim() || !emailUser.trim() || !passwordUser.trim()) {
      setError("Debes completar todos los datos del nuevo usuario.");
      return;
    }

    try {
      const actualizados = await crearUsuarioAdmin(
        nombreUser,
        emailUser,
        passwordUser,
        rolUser,
      );
      setUsuarios(actualizados);
      setNombreUser("");
      setEmailUser("");
      setPasswordUser("");
      setRolUser("cliente");
      mostrarAviso("Usuario creado correctamente.");
    } catch (err) {
      setError(err.message);
    }
  }

  function handleCambioRol(id, nuevoRol) {
    const actualizados = cambiarRolUsuario(id, nuevoRol);
    setUsuarios(actualizados);
    mostrarAviso("Rol de usuario actualizado.");
  }

  function handleEliminarUsuario(id) {
    if (id === adminActual.id) {
      setError("No podes eliminar tu propia cuenta mientras estás logueado.");
      return;
    }
    const actualizados = eliminarUsuario(id);
    setUsuarios(actualizados);
    mostrarAviso("Usuario eliminado");
  }

  // handlers pedidos
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
          onClick={() => setTabActiva("joyas")}>
          Catálogo de Joyas ({joyas.length})
        </button>
        <button
          type="button"
          className={tabActiva === "pedidos" ? "admin-tab active" : "admin-tab"}
          onClick={() => setTabActiva("pedidos")}>
          Pedidos y Taller ({pedidos.length})
        </button>
        <button
          type="button"
          className={
            tabActiva === "usuarios" ? "admin-tab active" : "admin-tab"
          }
          onClick={() => setTabActiva("usuarios")}>
          Usuarios ({usuarios.length})
        </button>
      </div>

      <AlertModal
        mensaje={mensaje}
        tipo="exito"
        onCerrar={() => setMensaje("")}
      />
      <AlertModal mensaje={error} tipo="error" onCerrar={() => setError("")} />

      {/* pestaña 1: ABM JOYAS */}
      {tabActiva === "joyas" && (
        <div className="admin-split">
          <div className="admin-card">
            <h3>{joyaEditandoId ? "Editar Joya" : "Agregar Nueva Joya"}</h3>
            <form onSubmit={handleGuardarJoya} className="admin-form">
              <div className="form-group">
                <label htmlFor="j-nombre">Nombre de la pieza</label>
                <input
                  id="j-nombre"
                  type="text"
                  value={nombreJoya}
                  onChange={(e) => setNombreJoya(e.target.value)}
                  placeholder="Ej. Anillo Corona Solar"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="j-cat">Categoría</label>
                  <select
                    id="j-cat"
                    value={categoriaJoya}
                    onChange={(e) => setCategoriaJoya(e.target.value)}>
                    <option value="Anillos">Anillos</option>
                    <option value="Collares">Collares</option>
                    <option value="Aros">Aros</option>
                    <option value="Pulseras">Pulseras</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="j-mat">Material</label>
                  <select
                    id="j-mat"
                    value={materialJoya}
                    onChange={(e) => setMaterialJoya(e.target.value)}>
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
                    value={precioJoya}
                    onChange={(e) => setPrecioJoya(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="j-stock">Stock</label>
                  <input
                    id="j-stock"
                    type="number"
                    min="0"
                    value={stockJoya}
                    onChange={(e) => setStockJoya(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="j-img">URL de imagen (opcional)</label>
                <input
                  id="j-img"
                  type="url"
                  value={imagenJoya}
                  onChange={(e) => setImagenJoya(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="j-desc">Descripción</label>
                <input
                  id="j-desc"
                  type="text"
                  value={descripcionJoya}
                  onChange={(e) => setDescripcionJoya(e.target.value)}
                  placeholder="Detalles del acabado o piedra..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {joyaEditandoId ? "Guardar Cambios" : "Crear Joya"}
                </button>
                {joyaEditandoId && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={limpiarFormJoya}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

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
                          onClick={() => cargarJoyaParaEditar(joya)}>
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn-table-del"
                          onClick={() => handleEliminarJoya(joya.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* pestaña 2: GESTIONAR PEDIDOS Y TALLER */}
      {tabActiva === "pedidos" && (
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
                        onChange={(e) =>
                          handleEstadoPedido(pedido.id, e.target.value)
                        }>
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
      )}

      {/* pestaña 3: ABM USUARIOS */}
      {tabActiva === "usuarios" && (
        <div className="admin-split">
          <div className="admin-card">
            <h3>Alta de Usuario</h3>
            <form onSubmit={handleCrearUsuario} className="admin-form">
              <div className="form-group">
                <label htmlFor="u-nombre">Nombre completo</label>
                <input
                  id="u-nombre"
                  type="text"
                  value={nombreUser}
                  onChange={(e) => setNombreUser(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="u-email">Email</label>
                <input
                  id="u-email"
                  type="email"
                  value={emailUser}
                  onChange={(e) => setEmailUser(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="u-pass">Contraseña</label>
                <input
                  id="u-pass"
                  type="password"
                  value={passwordUser}
                  onChange={(e) => setPasswordUser(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="u-rol">Rol asignado</label>
                <select
                  id="u-rol"
                  value={rolUser}
                  onChange={(e) => setRolUser(e.target.value)}>
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <button type="submit" className="btn-primary">
                Registrar Usuario
              </button>
            </form>
          </div>

          <div className="admin-card">
            <h3>Usuarios Registrados</h3>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          className="select-estado"
                          value={u.rol}
                          disabled={u.id === adminActual.id}
                          onChange={(e) =>
                            handleCambioRol(u.id, e.target.value)
                          }>
                          <option value="cliente">Cliente</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-table-del"
                          disabled={u.id === adminActual.id}
                          onClick={() => handleEliminarUsuario(u.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
