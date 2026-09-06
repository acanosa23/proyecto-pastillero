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

function TarjetaEstado({ titulo, toma, emoji }) {
  return (
    <div
      className={`rounded-2xl p-6 w-40 text-center shadow-md border-2 ${
        toma ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-300'
      }`}
    >
      <div className="text-4xl mb-2">{emoji}</div>
      <div className="font-semibold text-slate-700">{titulo}</div>
      <div className="text-2xl mt-2">{toma ? '✅' : '⬜'}</div>
      {toma && (
        <div className="text-xs text-slate-500 mt-1">{horaMadrid(new Date(toma.taken_at))}</div>
      )}
    </div>
  );
}

function FilaHistorial({ fecha, manana, noche }) {
  return (
    <div className="flex items-center justify-between w-full max-w-sm bg-white/70 rounded-xl px-4 py-2 shadow-sm">
      <span className="text-sm text-slate-600 capitalize">{nombreDia(fecha)}</span>
      <div className="flex gap-3 text-xl">
        <span>{manana ? '🌅✅' : '🌅⬜'}</span>
        <span>{noche ? '🌙✅' : '🌙⬜'}</span>
      </div>
    </div>
  );
}

export default async function Home() {
  const { data: tomas } = await supabase
    .from('tomas')
    .select('period, taken_at')
    .order('taken_at', { ascending: false })
    .limit(30);

  const dias = ultimosDias(7);
  const historial = dias.map((fecha) => {
    const delDia = (tomas || []).filter((t) => fechaMadrid(new Date(t.taken_at)) === fecha);
    return {
      fecha,
      manana: delDia.find((t) => t.period === 'mañana'),
      noche: delDia.find((t) => t.period === 'noche'),
    };
  });

  const hoy = historial[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col items-center gap-6 p-6">
      <h1 className="text-3xl font-bold text-slate-700 text-center mt-4">
        ¿Me he empastillado hoy?
      </h1>

      <div className="flex gap-4 flex-wrap justify-center">
        <TarjetaEstado titulo="Café pastillero" toma={hoy.manana} emoji="🌅" />
        <TarjetaEstado titulo="Yogur con pastillas" toma={hoy.noche} emoji="🌙" />
      </div>

      <BotonManual />

      <div className="w-full flex flex-col items-center gap-2 mt-6">
        <h2 className="text-lg font-semibold text-slate-600">Últimos 7 días</h2>
        {historial.map((dia) => (
          <FilaHistorial key={dia.fecha} {...dia} />
        ))}
      </div>
    </main>
  );
}
