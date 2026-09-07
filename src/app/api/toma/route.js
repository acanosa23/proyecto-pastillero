import { createClient } from '@supabase/supabase-js';
import { calcularPeriodo } from '@/lib/fechas';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  let tagId = null;

  if (code) {
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('code', code)
      .single();

    if (tagError || !tag) {
      return Response.redirect(`${url.origin}/?error=tag`, 302);
    }
    tagId = tag.id;
  }

  const period = calcularPeriodo(new Date());

  const { error: insertError } = await supabase
    .from('tomas')
    .insert({ tag_id: tagId, period, source: code ? 'nfc' : 'manual' });

  if (insertError) {
    return Response.redirect(`${url.origin}/?error=guardar`, 302);
  }

  return Response.redirect(`${url.origin}/?registrado=1`, 302);
}
