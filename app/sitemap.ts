import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://qrpop.it';

  // Tutte le rotte pubbliche da indicizzare
  const routes = [
    '',
    '/menu-digitale-ristoranti',
    '/qr-code-recensioni-google',
    '/accedi',
    '/register',
    '/privacy',
    '/termini',
    '/forgot-password'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
