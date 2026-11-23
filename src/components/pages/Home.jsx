import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { obtenerJoyas, guardarJoyas } from "../../services/joyasService";
import { crearPedido } from "../../services/pedidosService";
import { JoyaCard } from "../JoyaCard";
import { AlertModal } from "../AlertModal";
import "./Home.css";

export function Home() {
  const [joyas, setJoyas] = useState(() => obtenerJoyas());
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroMaterial, setFiltroMaterial] = useState("Todos");
  const [mensaje, setMensaje] = useState("");

  const { usuario } = useAuth();
  const navigate = useNavigate();

  function handleComprar(joyaSeleccionada) {
    if (!usuario) {
      navigate("/login");
      return;
    }

    // descuenta 1 unidad del stock
    const joyasActualizadas = joyas.map((j) => {
      if (j.id === joyaSeleccionada.id) {
        return { ...j, stock: j.stock - 1 };
      }
      return j;
    });

    guardarJoyas(joyasActualizadas);
    setJoyas(joyasActualizadas);

    // genera pedido sefun cliente
    const descripcionPieza = `${joyaSeleccionada.nombre} (${joyaSeleccionada.material})`;

    const nuevoPedido = {
      id: Date.now(),
      usuarioId: usuario.id,
      clienteNombre: usuario.nombre,
      tipo: "Compra de catálogo",
      detalleBase: descripcionPieza,
      detalle: descripcionPieza,
      cantidad: 1,
      fecha: new Date().toISOString().split("T")[0],
      total: joyaSeleccionada.precio,
      estado: "Pendiente",
    };
    
    crearPedido(nuevoPedido);
    setMensaje(`¡Solicitaste "${joyaSeleccionada.nombre}"! Podés seguirlo en Mis Pedidos.`);
   
  }

  const joyasFiltradas = joyas.filter((joya) => {
    const coincideCategoria =
      filtroCategoria === "Todas" || joya.categoria === filtroCategoria;
    const coincideMaterial =
      filtroMaterial === "Todos" || joya.material === filtroMaterial;
    return coincideCategoria && coincideMaterial;
  });

  return (
    <section className="home-page">
      <div className="hero-banner">
        <h1>Orfebrería Forjada a Mano</h1>
        <p>
          Piezas únicas en oro y plata de ley, creadas en nuestro taller
          artesanal.
        </p>
      </div>

      <AlertModal
        mensaje={mensaje}
        tipo="exito"
        onCerrar={() => setMensaje("")}
      />

      <div className="filtros-bar">
        <div className="filtro-grupo">
          <label htmlFor="cat-select">Categoría:</label>
          <select
            id="cat-select"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="Todas">Todas</option>
            <option value="Anillos">Anillos</option>
            <option value="Collares">Collares</option>
            <option value="Aros">Aros</option>
            <option value="Pulseras">Pulseras</option>
            <option value="Accesorios">Accesorios</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="mat-select">Material:</label>
          <select
            id="mat-select"
            value={filtroMaterial}
            onChange={(e) => setFiltroMaterial(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Oro 18k">Oro 18k</option>
            <option value="Plata 925">Plata 925</option>
            <option value="Bronce">Bronce</option>

          </select>
        </div>
      </div>

      {joyasFiltradas.length === 0 ? (
        <p className="sin-resultados">
          No hay piezas que coincidan con esos filtros.
        </p>
      ) : (
        <div className="joyas-grid">
          {joyasFiltradas.map((joya) => (
            <JoyaCard
              key={joya.id}
              joya={joya}
              usuario={usuario}
              onComprar={handleComprar}
            />
          ))}
        </div>
      )}
    </section>
  );
}
