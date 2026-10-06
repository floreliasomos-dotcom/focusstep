import type { MetadataRoute } from 'next';

const SITIO = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// Solo la página de ventas y los textos legales son públicos para buscadores; la app interna y el
// camino de compra son personales y no se indexan.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: ['/', '/privacidad', '/terminos', '/reembolsos', '/aviso-ia'], disallow: ['/hoy', '/habitos', '/progreso', '/perfil', '/onboarding', '/paywall', '/entrar'] },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}
