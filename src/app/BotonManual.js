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
      className="mt-4 rounded-full bg-sky-500 px-6 py-3 text-white font-semibold shadow hover:bg-sky-600 disabled:opacity-50 transition"
    >
      {cargando ? 'Registrando...' : '💊 Registrar toma manualmente'}
    </button>
  );
}
