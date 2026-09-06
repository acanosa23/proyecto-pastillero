'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BotonManual() {
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  async function registrar() {
    setCargando(true);
    await fetch('/api/toma');
    setCargando(false);
    router.refresh();
  }

  return (
    <button
      onClick={registrar}
      disabled={cargando}
      className="mt-2 max-w-xs rounded-3xl bg-gradient-to-r from-sky-400 to-blue-500 px-6 py-4 text-white font-semibold shadow-lg hover:shadow-xl active:scale-95 transition disabled:opacity-50 text-sm text-center"
    >
      {cargando
        ? 'Registrando...'
        : 'Me he tomado la pastilla, pero no me da la gana de hacer caso a mi hijo Álvaro'}
    </button>
  );
}
