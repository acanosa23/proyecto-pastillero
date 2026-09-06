import { createClient } from '@supabase/supabase-js';
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
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(fecha);
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

function TarjetaEstado({ titulo, toma, extra, emoji }) {
  return (
    <div
      className={`rounded-3xl p-6 w-44 text-center shadow-lg border-2 transition-transform active:scale-95 ${
        toma
          ? 'bg-gradient-to-b from-green-100 to-emerald-50 border-emerald-300'
          : 'bg-white border-slate-200'
      }`}
    >
      <div className="text-5xl mb-2">{emoji}</div>
      <div className="font-semibold text-slate-700">{titulo}</div>
      <div className="text-3xl mt-2">{toma ? '✅' : '⬜'}</div>
      {toma && (
        <>
          <div className="text-xs text-slate-500 mt-2">{horaMadrid(new Date(toma.taken_at))}</div>
          <div className="text-xs text-slate-400">{origenTexto(toma)}</div>
          {extra && <div className="text-xs text-amber-600 mt-1">Registrado más de una vez</div>}
        </>
      )}
    </div>
  );
}

function FilaHistorial({ fecha, manana, noche }) {
  return (
    <div className="flex items-center justify-between w-full max-w-sm bg-white rounded-2xl px-4 py-3 shadow-sm">
      <span className="text-sm font-medium text-slate-600 capitalize">{nombreDia(fecha)}</span>
      <div className="flex gap-3 text-xl">
        <span>{manana ? '🌅✅' : '🌅⬜'}</span>
        <span>{noche ? '🌙✅' : '🌙⬜'}</span>
      </div>
    </div>
  );
}

export default async function Home() {
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
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-sky-100 flex flex-col items-center gap-6 p-6">
      <h1 className="text-4xl font-bold text-slate-700 text-center mt-6">
        ¿Me he empastillado hoy? 💊
      </h1>

      {racha > 0 && (
        <div className="bg-gradient-to-r from-orange-400 to-amber-400 text-white font-semibold px-5 py-2 rounded-full shadow">
          🔥 {racha} {racha === 1 ? 'día seguido' : 'días seguidos'} sin fallar
        </div>
      )}

      <div className="flex gap-4 flex-wrap justify-center">
        <TarjetaEstado titulo="Café pastillero" toma={hoy.manana} extra={hoy.mananaExtra} emoji="🌅" />
        <TarjetaEstado titulo="Yogur con pastillas" toma={hoy.noche} extra={hoy.nocheExtra} emoji="🌙" />
      </div>

      <BotonManual />

      <div className="w-full flex flex-col items-center gap-2 mt-6 max-w-sm">
        <h2 className="text-lg font-semibold text-slate-600">Últimos 7 días</h2>
        {historial.map((dia) => (
          <FilaHistorial key={dia.fecha} {...dia} />
        ))}
      </div>
    </main>
  );
}
