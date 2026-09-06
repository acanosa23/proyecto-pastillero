import { createClient } from '@supabase/supabase-js';

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

  const ahora = new Date();
  const period = calcularPeriodo(ahora);

  const { error: insertError } = await supabase
    .from('tomas')
    .insert({ tag_id: tagId, period, source: code ? 'nfc' : 'manual' });

  if (insertError) {
    return Response.redirect(`${url.origin}/?error=guardar`, 302);
  }

  return Response.redirect(`${url.origin}/?registrado=1`, 302);
}

function calcularPeriodo(fecha) {
  const formatter = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const partes = formatter.formatToParts(fecha);
  const hora = parseInt(partes.find((p) => p.type === 'hour').value, 10);
  const minuto = parseInt(partes.find((p) => p.type === 'minute').value, 10);
  const minutosDelDia = hora * 60 + minuto;
  const inicioManana = 5 * 60;
  const finManana = 14 * 60;
  return minutosDelDia >= inicioManana && minutosDelDia <= finManana ? 'mañana' : 'noche';
}
