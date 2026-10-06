import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FocusStep',
    short_name: 'FocusStep',
    description: 'Un solo paso a la vez, sin culpa.',
    start_url: '/hoy',
    display: 'standalone',
    background_color: '#FBF1E8',
    theme_color: '#BD5227',
    lang: 'es',
    icons: [{ src: '/icon', sizes: '512x512', type: 'image/png' }],
  };
}
