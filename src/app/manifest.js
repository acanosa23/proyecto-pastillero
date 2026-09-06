export default function manifest() {
  return {
    name: 'Pastillas de Mamá',
    short_name: 'Pastillas',
    description: 'Recordatorio de pastillas de mañana y noche',
    start_url: '/',
    display: 'standalone',
    background_color: '#f0f9ff',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
