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
    <button onClick={registrar} disabled={cargando}>
      {cargando ? 'Registrando...' : 'Registrar toma manualmente'}
    </button>
  );
}
