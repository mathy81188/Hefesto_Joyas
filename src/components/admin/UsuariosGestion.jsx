import { useState } from "react";

export function UsuariosGestion({
  usuarios,
  adminActualId,
  onCrearUsuario,
  onCambiarRol,
  onEliminarUsuario,
  onError,
}) {
  const [nombreUser, setNombreUser] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [passwordUser, setPasswordUser] = useState("");
  const [rolUser, setRolUser] = useState("cliente");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nombreUser.trim() || !emailUser.trim() || !passwordUser.trim()) {
      onError("Debes completar todos los datos del nuevo usuario.");
      return;
    }

    const creado = await onCrearUsuario({
      nombre: nombreUser,
      email: emailUser,
      password: passwordUser,
      rol: rolUser,
    });

    if (creado) {
      setNombreUser("");
      setEmailUser("");
      setPasswordUser("");
      setRolUser("cliente");
    }
  }

  return (
    <div className="admin-split">
      <div className="admin-card">
        <h3>Alta de Usuario</h3>
        <form onSubmit={handleSubmit} className="admin-form">
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
              onChange={(e) => setRolUser(e.target.value)}
            >
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
                      disabled={u.id === adminActualId}
                      onChange={(e) => onCambiarRol(u.id, e.target.value)}
                    >
                      <option value="cliente">Cliente</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-table-del"
                      disabled={u.id === adminActualId}
                      onClick={() => onEliminarUsuario(u.id)}
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
    </div>
  );
}