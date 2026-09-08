import { createClient } from '@supabase/supabase-js';
import { Coffee, Moon, Check, Circle, Flame } from 'lucide-react';
import BotonManual from './BotonManual';
import LimpiarUrl from './LimpiarUrl';
import { fechaMadrid, horaMadrid, diaDeToma, ultimosDias, nombreDiaCorto, nombreDiaLargo } from '@/lib/fechas';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const OSCURO = '#045952';
const TEAL = '#4FB3AC';
const CREMA = '#FBF3DD';
const ACENTO = '#F4502A';

function construirDia(fecha, tomas) {
  const delDia = tomas.filter((t) => diaDeToma(new Date(t.taken_at)) === fecha);
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
    <div className="p-4 w-36 text-center" style={{ backgroundColor: hecha ? TEAL : CREMA, color: hecha ? '#fff' : OSCURO }}>
      <Icono className="mx-auto mb-1" size={26} />
      <div className="font-semibold text-sm">{titulo}</div>
      <div className="mt-1 flex justify-center">{hecha ? <Check size={22} /> : <Circle size={22} />}</div>
      {hecha && (
        <>
          <div className="text-[10px] mt-1">{horaMadrid(new Date(toma.taken_at))}</div>
          <div className="text-[10px]">{origenTexto(toma)}</div>
          {extra && (
            <div className="text-[10px] mt-1" style={{ color: ACENTO }}>
              Registrado 2 veces
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilaHistorial({ fecha, manana, noche }) {
  const completo = !!(manana && noche);
  const celda = (activo) => ({ backgroundColor: activo ? TEAL : CREMA, color: activo ? '#fff' : OSCURO });
  const base = 'flex-1 flex items-center justify-center py-2 text-xs';
  return (
    <div className="flex gap-1 w-full max-w-sm">
      <div className={`${base} font-semibold`} style={celda(completo)}>
        {nombreDiaCorto(fecha)}
      </div>
      <div className={base} style={celda(!!manana)}>
        <Coffee size={14} />
      </div>
      <div className={base} style={celda(!!noche)}>
        <Moon size={14} />
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
  const hoyStr = fechaMadrid(new Date());

  return (
    <main className="min-h-screen flex flex-col items-center gap-3 p-4 bg-white" style={{ color: OSCURO }}>
      <LimpiarUrl />
      <h1 className="text-3xl font-extrabold uppercase tracking-wide text-center mt-1">NO MÁS COSÍN</h1>
      <p className="text-sm -mt-2">{nombreDiaLargo(hoyStr)}</p>

      {registrado && (
        <div className="flex items-center gap-2 font-bold px-4 py-2 text-sm" style={{ backgroundColor: TEAL, color: '#fff' }}>
          <Check size={16} /> ¡Estoy empastillada!
        </div>
      )}
      {error && (
        <div className="px-4 py-2 font-semibold text-sm" style={{ backgroundColor: '#fbe4e4', color: OSCURO }}>
          Algo no ha ido bien — avisa a Álvaro
        </div>
      )}

      {racha > 0 && (
        <div className="flex items-center gap-1 font-bold" style={{ color: ACENTO }}>
          <Flame size={24} fill={ACENTO} strokeWidth={0} />
          <span className="text-lg">{racha}</span>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <TarjetaEstado titulo="Café pastillero" toma={hoy.manana} extra={hoy.mananaExtra} Icono={Coffee} />
        <TarjetaEstado titulo="Yogur con Vimpat" toma={hoy.noche} extra={hoy.nocheExtra} Icono={Moon} />
      </div>

      <BotonManual />

      <div className="w-full flex flex-col items-center gap-1 mt-4 max-w-sm">
        <h2 className="text-sm font-semibold">Últimos 7 días</h2>
        {historial.map((dia) => (
          <FilaHistorial key={dia.fecha} {...dia} />
        ))}
      </div>
    </main>
  );
}
