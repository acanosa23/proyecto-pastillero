export default function manifest() {
  return {
    name: 'Pastillas de Mamá',
    short_name: 'Pastillas',
    description: 'Recordatorio de pastillas de mañana y noche',
    start_url: '/',
    display: 'standalone',
    background_color: '#E7DDC6',
    theme_color: '#0E3529',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
