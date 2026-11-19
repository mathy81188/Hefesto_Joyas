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
  pedidos.unshift(nuevoPedido);
  localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
  return nuevoPedido;
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