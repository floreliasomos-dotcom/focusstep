import type { MetadataRoute } from 'next';

const SITIO = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/privacidad', '/terminos', '/reembolsos', '/aviso-ia'].map((ruta) => ({
    url: `${SITIO}${ruta}`,
    changeFrequency: ruta === '/' ? 'weekly' : 'yearly',
    priority: ruta === '/' ? 1 : 0.3,
  }));
}
