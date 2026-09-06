import { createClient } from '@supabase/supabase-js';
import { Coffee, Moon, Check, Circle, Flame } from 'lucide-react';
import BotonManual from './BotonManual';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function fechaMadrid(fecha) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(fecha);
}

function horaMadrid(fecha) {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
  }).format(fecha);
}

function ultimosDias(n) {
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

function nombreDia(fechaStr) {
  const [y, m, d] = fechaStr.split('-').map(Number);
  const fecha = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short', timeZone: 'UTC' }).format(fecha);
}

function construirDia(fecha, tomas) {
  const delDia = tomas.filter((t) => fechaMadrid(new Date(t.taken_at)) === fecha);
  const mananas = delDia
    .filter((t) => t.period === 'mañana')
    .sort((a, b) => new Date(a.taken_at) - new Date(b.taken_at));
  const noches = delDia
    .filter((t) => t.period === 'noche')
    .sort((a, b) => new Date(a.taken_at) - new Date(b.taken_at));
  return {
    fecha,
    manana: mananas[0] || null,
    mananaExtra: mananas.length > 1,
    noche: noches[0] || null,
    nocheExtra: noches.length > 1,
  };
}

function calcularRacha(dias) {
  let lista = dias;
  if (!(lista[0].manana && lista[0].noche)) {
    lista = lista.slice(1);
  }
  let racha = 0;
  for (const dia of lista) {
    if (dia.manana && dia.noche) {
      racha++;
    } else {
      break;
    }
  }
  return racha;
}

function origenTexto(toma) {
  if (!toma) return '';
  return toma.tags?.name ? toma.tags.name : 'Registrado a mano';
}

function TarjetaEstado({ titulo, toma, extra, Icono }) {
  const hecha = !!toma;
  return (
    <div
      className={`rounded-2xl p-6 w-44 text-center border-2 ${
        hecha ? 'bg-green-600 border-green-700 text-white' : 'bg-stone-100 border-stone-200 text-black'
      }`}
    >
      <Icono className="mx-auto mb-2" size={36} />
      <div className="font-semibold">{titulo}</div>
      <div className="mt-2 flex justify-center">
        {hecha ? <Check size={28} /> : <Circle size={28} className="text-stone-300" />}
      </div>
      {hecha && (
        <>
          <div className="text-xs mt-2 text-green-100">{horaMadrid(new Date(toma.taken_at))}</div>
          <div className="text-xs text-green-100">{origenTexto(toma)}</div>
          {extra && <div className="text-xs text-yellow-200 mt-1">Registrado más de una vez</div>}
        </>
      )}
    </div>
  );
}

function FilaHistorial({ fecha, manana, noche }) {
  const completo = !!(manana && noche);
  const base = 'flex-1 flex items-center justify-center py-3 rounded-lg';
  return (
    <div className="flex gap-1 w-full max-w-sm">
      <div className={`${base} font-semibold capitalize text-sm ${completo ? 'bg-green-600 text-white' : 'bg-stone-100 text-black'}`}>
        {nombreDia(fecha)}
      </div>
      <div className={`${base} ${manana ? 'bg-green-600 text-white' : 'bg-stone-100 text-stone-400'}`}>
        <Coffee size={18} />
      </div>
      <div className={`${base} ${noche ? 'bg-green-600 text-white' : 'bg-stone-100 text-stone-400'}`}>
        <Moon size={18} />
      </div>
    </div>
  );
}

export default async function Home({ searchParams }) {
  const sp = await searchParams;
  const registrado = sp?.registrado;
  const error = sp?.error;

  const { data: tomasCrudas } = await supabase
    .from('tomas')
    .select('period, taken_at, source, tags(name)')
    .order('taken_at', { ascending: false })
    .limit(60);

  const tomas = tomasCrudas || [];
  const dias30 = ultimosDias(30).map((fecha) => construirDia(fecha, tomas));
  const racha = calcularRacha(dias30);
  const historial = dias30.slice(0, 7);
  const hoy = historial[0];

  return (
    <main className="min-h-screen bg-green-50 text-black flex flex-col items-center gap-6 p-6">
      <h1 className="text-5xl sm:text-6xl font-bold text-center mt-6">¿Me he empastillado hoy?</h1>

      {registrado && (
        <div className="flex items-center gap-2 bg-green-600 text-white font-bold px-6 py-3 rounded-full">
          <Check size={20} />
          ¡Estoy empastillada!
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 px-6 py-3 rounded-full font-semibold">
          Algo no ha ido bien — avisa a Álvaro
        </div>
      )}

      {racha > 0 && (
        <div className="relative w-24 h-24 flex items-center justify-center">
          <Flame className="w-24 h-24 text-orange-500" fill="currentColor" strokeWidth={0} />
          <span className="absolute text-white font-extrabold text-3xl mt-2">{racha}</span>
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <TarjetaEstado titulo="Café pastillero" toma={hoy.manana} extra={hoy.mananaExtra} Icono={Coffee} />
        <TarjetaEstado titulo="Yogur con Vimpat" toma={hoy.noche} extra={hoy.nocheExtra} Icono={Moon} />
      </div>

      <BotonManual />

      <div className="w-full flex flex-col items-center gap-2 mt-6 max-w-sm">
        <h2 className="text-lg font-semibold">Últimos 7 días</h2>
        {historial.map((dia) => (
          <FilaHistorial key={dia.fecha} {...dia} />
        ))}
      </div>
    </main>
  );
}
