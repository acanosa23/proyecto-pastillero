import { createClient } from '@supabase/supabase-js';
import { Coffee, Moon, Check, Circle, Flame } from 'lucide-react';
import BotonManual from './BotonManual';
import { fechaMadrid, horaMadrid, diaDeToma, ultimosDias, nombreDiaCorto, nombreDiaLargo } from '@/lib/fechas';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const OSCURO = '#0E3529';
const VERDE = '#4B8A6C';
const BEIGE = '#E7DDC6';
const ORO = '#B89B4A';

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
    <div
      className="p-6 w-44 text-center border-4"
      style={{
        backgroundColor: hecha ? VERDE : BEIGE,
        borderColor: OSCURO,
        color: hecha ? '#fff' : OSCURO,
        boxShadow: `4px 4px 0px ${OSCURO}`,
      }}
    >
      <Icono className="mx-auto mb-2" size={36} />
      <div className="font-semibold">{titulo}</div>
      <div className="mt-2 flex justify-center">
        {hecha ? <Check size={28} /> : <Circle size={28} />}
      </div>
      {hecha && (
        <>
          <div className="text-xs mt-2">{horaMadrid(new Date(toma.taken_at))}</div>
          <div className="text-xs">{origenTexto(toma)}</div>
          {extra && (
            <div className="text-xs mt-1" style={{ color: ORO }}>
              Registrado más de una vez
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FilaHistorial({ fecha, manana, noche }) {
  const completo = !!(manana && noche);
  const celda = (activo) => ({
    backgroundColor: activo ? VERDE : BEIGE,
    color: activo ? '#fff' : OSCURO,
    borderColor: OSCURO,
  });
  const base = 'flex-1 flex items-center justify-center py-3 border-2';
  return (
    <div className="flex w-full max-w-sm">
      <div className={`${base} font-semibold text-sm`} style={celda(completo)}>
        {nombreDiaCorto(fecha)}
      </div>
      <div className={base} style={celda(!!manana)}>
        <Coffee size={18} />
      </div>
      <div className={base} style={celda(!!noche)}>
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
  const hoyStr = fechaMadrid(new Date());

  return (
    <main className="min-h-screen bg-white flex flex-col items-center gap-6 p-6" style={{ color: OSCURO }}>
      <h1 className="text-5xl sm:text-6xl font-bold text-center mt-6">¿Me he empastillado hoy?</h1>
      <p className="text-lg capitalize -mt-4">{nombreDiaLargo(hoyStr)}</p>

      {registrado && (
        <div
          className="flex items-center gap-2 font-bold px-6 py-3 border-4"
          style={{ backgroundColor: VERDE, borderColor: OSCURO, color: '#fff' }}
        >
          <Check size={20} />
          ¡Estoy empastillada!
        </div>
      )}
      {error && (
        <div className="px-6 py-3 font-semibold border-4" style={{ backgroundColor: '#fbe4e4', borderColor: OSCURO }}>
          Algo no ha ido bien — avisa a Álvaro
        </div>
      )}

      {racha > 0 && (
        <div className="relative w-24 h-24 flex items-center justify-center">
          <Flame className="w-24 h-24" style={{ color: ORO }} fill={ORO} strokeWidth={0} />
          <span className="absolute font-extrabold text-3xl mt-2" style={{ color: OSCURO }}>
            {racha}
          </span>
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
