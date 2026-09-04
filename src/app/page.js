import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function Home() {
  const { data: tomas, error } = await supabase
    .from('tomas')
    .select('period, taken_at, source')
    .order('taken_at', { ascending: false })
    .limit(10);

  return (
    <main>
      <h1>Pastillas</h1>
      <pre>{JSON.stringify({ tomas, error }, null, 2)}</pre>
    </main>
  );
}
