import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/gestione/', '/api/', '/cookie'],
    },
    sitemap: 'https://qrpop.it/sitemap.xml',
  };
}
