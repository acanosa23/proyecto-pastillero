import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function fechaMadrid(fecha) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(fecha);
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
    <main>
      <h1>Pastillas de hoy</h1>
      <p>Mañana: {manana ? '✅ tomada' : '⬜ pendiente'}</p>
      <p>Noche: {noche ? '✅ tomada' : '⬜ pendiente'}</p>
    </main>
  );
}
