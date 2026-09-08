export default function manifest() {
  return {
    name: 'Pastillas de Mamá',
    short_name: 'Pastillas',
    description: 'Recordatorio de pastillas de mañana y noche',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF3DD',
    theme_color: '#045952',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
