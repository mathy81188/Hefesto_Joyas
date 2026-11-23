const PEDIDOS_KEY = "hefesto_pedidos";

export function obtenerPedidos() {
  const data = localStorage.getItem(PEDIDOS_KEY);
  if (!data) {
    return [];
  }
  return JSON.parse(data);
}

export function crearPedido(nuevoPedido) {
  const pedidos = obtenerPedidos();

  if (nuevoPedido.tipo === "Compra de catálogo") {
    const detalleBase = nuevoPedido.detalleBase || nuevoPedido.detalle;
    const indiceExistente = pedidos.findIndex(
      (p) =>
        p.usuarioId === nuevoPedido.usuarioId &&
        p.tipo === "Compra de catálogo" &&
        p.estado === "Pendiente" &&
        (p.detalleBase || p.detalle) === detalleBase
    );

    if (indiceExistente !== -1) {
      const existente = pedidos[indiceExistente];
      const nuevaCantidad = (existente.cantidad || 1) + 1;

      pedidos[indiceExistente] = {
        ...existente,
        detalleBase: detalleBase,
        cantidad: nuevaCantidad,
        detalle: `${detalleBase} (x${nuevaCantidad})`,
        total: existente.total + nuevoPedido.total,
        fecha: nuevoPedido.fecha,
      };

      localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
      return pedidos;
    }
  }

  const actualizados = [
    {
      ...nuevoPedido,
      detalleBase: nuevoPedido.detalleBase || nuevoPedido.detalle,
      cantidad: nuevoPedido.cantidad || 1,
    },
    ...pedidos,
  ];

  localStorage.setItem(PEDIDOS_KEY, JSON.stringify(actualizados));
  return actualizados;
}

export function actualizarEstadoPedido(pedidoId, nuevoEstado) {
  const pedidos = obtenerPedidos();
  const actualizados = pedidos.map((p) => {
    if (p.id === pedidoId) {
      return { ...p, estado: nuevoEstado };
    }
    return p;
  });
  localStorage.setItem(PEDIDOS_KEY, JSON.stringify(actualizados));
  return actualizados;
}

export function eliminarPedido(pedidoId) {
  const pedidos = obtenerPedidos();
  const actualizados = pedidos.filter((p) => p.id !== pedidoId);
  localStorage.setItem(PEDIDOS_KEY, JSON.stringify(actualizados));
  return actualizados;
}
