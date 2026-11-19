const JOYAS_KEY = "hefesto_joyas";

export function obtenerJoyas() {
  const data = localStorage.getItem(JOYAS_KEY);
  if (!data) {
    return [];
  }
  return JSON.parse(data);
}

export function guardarJoyas(listaJoyas) {
  localStorage.setItem(JOYAS_KEY, JSON.stringify(listaJoyas));
}