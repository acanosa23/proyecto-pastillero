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

function TarjetaEstado({ titulo, hecha, emoji }) {
  return (
    <div
      className={`rounded-2xl p-6 w-40 text-center shadow-md border-2 ${
        hecha ? 'bg-green-100 border-green-400' : 'bg-gray-100 border-gray-300'
      }`}
    >
      <div className="text-4xl mb-2">{emoji}</div>
      <div className="font-semibold text-slate-700">{titulo}</div>
      <div className="text-2xl mt-2">{hecha ? '✅' : '⬜'}</div>
    </div>
  );
}

export default async function Home() {
  const { data: tomas } = await supabase
    .from('tomas')
    .select('period, taken_at')
    .order('taken_at', { ascending: false })
    .limit(10);

  const hoy = fechaMadrid(new Date());
  const tomasHoy = (tomas || []).filter((t) => fechaMadrid(new Date(t.taken_at)) === hoy);

  const manana = tomasHoy.find((t) => t.period === 'mañana');
  const noche = tomasHoy.find((t) => t.period === 'noche');

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold text-slate-700">💊 Pastillas de hoy</h1>
      <div className="flex gap-4 flex-wrap justify-center">
        <TarjetaEstado titulo="Mañana" hecha={!!manana} emoji="🌅" />
        <TarjetaEstado titulo="Noche" hecha={!!noche} emoji="🌙" />
      </div>
      <BotonManual />
    </main>
  );
}
