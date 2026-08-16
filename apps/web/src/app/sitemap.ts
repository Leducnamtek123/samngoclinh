import type { MetadataRoute } from 'next';
import { routing } from '@/lib/I18nRouting';
import { getBaseUrl, getI18nPath } from '@/utils/Helpers';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();

  const routes = ['', '/about', '/counter', '/portfolio'];

  // Generate portfolio detail pages
  const portfolioRoutes = Array.from({ length: 6 }, (_, i) => `/portfolio/${i}`);
  const allRoutes = [...routes, ...portfolioRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.reduce<[string, string][]>((acc, locale) => {
          if (locale !== routing.defaultLocale) {
            acc.push([locale, `${baseUrl}${getI18nPath(route, locale)}`]);
          }
          return acc;
        }, []),
      ),
    },
  }));
}
