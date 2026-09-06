'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['700'] });

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
      <div className="mt-2 max-w-xs rounded-2xl bg-green-600 text-white font-bold px-6 py-4 text-center">
        ¡Estoy empastillada!
      </div>
    );
  }

  return (
    <button
      onClick={registrar}
      disabled={cargando}
      className={`${orbitron.className} mt-2 max-w-xs rounded-2xl bg-yellow-400 px-6 py-4 text-black text-xs shadow-lg hover:bg-yellow-300 active:scale-95 transition disabled:opacity-50 text-center`}
    >
      {cargando
        ? 'REGISTRANDO...'
        : 'ME HE TOMADO LA PASTILLA, PERO NO ME DA LA GANA DE HACER CASO A MI HIJO ÁLVARO'}
    </button>
  );
}
