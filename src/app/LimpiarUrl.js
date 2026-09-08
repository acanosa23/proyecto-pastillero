'use client';

import { useEffect } from 'react';

export default function LimpiarUrl() {
  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname);
  }, []);
  return null;
}
