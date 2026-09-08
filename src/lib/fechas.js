export function fechaMadrid(fecha) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(fecha);
}

export function horaMadrid(fecha) {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
  }).format(fecha);
}

function minutosDelDia(fecha) {
  const formatter = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const partes = formatter.formatToParts(fecha);
  const hora = parseInt(partes.find((p) => p.type === 'hour').value, 10);
  const minuto = parseInt(partes.find((p) => p.type === 'minute').value, 10);
  return hora * 60 + minuto;
}

export function calcularPeriodo(fecha) {
  const m = minutosDelDia(fecha);
  const inicioManana = 5 * 60;
  const finManana = 14 * 60;
  return m >= inicioManana && m <= finManana ? 'mañana' : 'noche';
}

function restarUnDia(fechaStr) {
  const [y, m, d] = fechaStr.split('-').map(Number);
  const f = new Date(Date.UTC(y, m - 1, d));
  f.setUTCDate(f.getUTCDate() - 1);
  return f.toISOString().slice(0, 10);
}

export function diaDeToma(fecha) {
  const dia = fechaMadrid(fecha);
  const m = minutosDelDia(fecha);
  return m < 5 * 60 ? restarUnDia(dia) : dia;
}

export function ultimosDias(n) {
  const hoyStr = fechaMadrid(new Date());
  const [anio, mes, dia] = hoyStr.split('-').map(Number);
  const base = new Date(Date.UTC(anio, mes - 1, dia));
  const dias = [];
  for (let i = 0; i < n; i++) {
    const f = new Date(base);
    f.setUTCDate(f.getUTCDate() - i);
    dias.push(f.toISOString().slice(0, 10));
  }
  return dias;
}

export function nombreDiaCorto(fechaStr) {
  const [y, m, d] = fechaStr.split('-').map(Number);
  const fecha = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', timeZone: 'UTC' }).format(fecha);
}

export function nombreDiaLargo(fechaStr) {
  const [y, m, d] = fechaStr.split('-').map(Number);
  const fecha = new Date(Date.UTC(y, m - 1, d));
  const texto = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(fecha);
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
