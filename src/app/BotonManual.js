'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['700'] });

const OSCURO = '#0E3529';
const VERDE = '#4B8A6C';
const ORO = '#B89B4A';

export default function BotonManual() {
  const [cargando, setCargando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const router = useRouter();

  async function registrar() {
    setCargando(true);
    await fetch('/api/toma');
    setCargando(false);
    setConfirmado(true);
    router.refresh();
    setTimeout(() => setConfirmado(false), 3000);
  }

  if (confirmado) {
    return (
      <div
        className="mt-2 max-w-xs font-bold px-6 py-4 text-center border-4"
        style={{ backgroundColor: VERDE, borderColor: OSCURO, color: '#fff' }}
      >
        ¡Estoy empastillada!
      </div>
    );
  }

  return (
    <button
      onClick={registrar}
      disabled={cargando}
      className={`${orbitron.className} mt-2 max-w-xs px-6 py-4 text-xs border-4 active:scale-95 transition disabled:opacity-50 text-center`}
      style={{ backgroundColor: ORO, borderColor: OSCURO, color: OSCURO, boxShadow: `4px 4px 0px ${OSCURO}` }}
    >
      {cargando
        ? 'REGISTRANDO...'
        : 'ME HE TOMADO LA PASTILLA, PERO NO ME DA LA GANA DE HACER CASO A MI HIJO ÁLVARO'}
    </button>
  );
}
