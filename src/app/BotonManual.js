'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['700'] });

const TEAL = '#4FB3AC';
const ACENTO = '#F4502A';

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
      <div className="mt-1 max-w-xs font-bold px-5 py-3 text-center text-sm" style={{ backgroundColor: TEAL, color: '#fff' }}>
        ¡Estoy empastillada!
      </div>
    );
  }

  return (
    <button
      onClick={registrar}
      disabled={cargando}
      className={`${orbitron.className} mt-1 max-w-xs px-5 py-3 text-[10px] active:scale-95 transition disabled:opacity-50 text-center`}
      style={{ backgroundColor: ACENTO, color: '#fff' }}
    >
      {cargando
        ? 'REGISTRANDO...'
        : 'ME HE TOMADO LA PASTILLA, PERO NO ME DA LA GANA DE HACER CASO A MI HIJO ÁLVARO'}
    </button>
  );
}
