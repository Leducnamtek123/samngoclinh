import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './I18nRouting';

// NextJS Boilerplate uses Crowdin as the localization software.
// As a developer, you only need to take care of the English (or another default language) version.
// Other languages are automatically generated and handled by Crowdin.

// The localisation files are synced with Crowdin using GitHub Actions.
// By default, there are 3 ways to sync the message files:
// 1. Automatically sync on push to the `main` branch
// 2. Run manually the workflow on GitHub Actions
// 3. Every 24 hours at 5am, the workflow will run automatically

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      output[key] &&
      typeof output[key] === 'object' &&
      !Array.isArray(output[key])
    ) {
      output[key] = deepMerge(
        output[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>,
      );
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

async function loadWebMessages(locale: string) {
  let rootMessages: Record<string, unknown> = {};
  try {
    rootMessages = await import(`../locales/${locale}.json`).then((m) => m.default);
  } catch {}

  const [common, marketing, auth, products, cart, profile, notifications] = await Promise.all([
    import(`../locales/${locale}/common.json`).then((m) => m.default).catch(() => ({})),
    import(`../locales/${locale}/marketing.json`).then((m) => m.default).catch(() => ({})),
    import(`../locales/${locale}/auth.json`).then((m) => m.default).catch(() => ({})),
    import(`../locales/${locale}/products.json`).then((m) => m.default).catch(() => ({})),
    import(`../locales/${locale}/cart.json`).then((m) => m.default).catch(() => ({})),
    import(`../locales/${locale}/profile.json`).then((m) => m.default).catch(() => ({})),
    import(`../locales/${locale}/notifications.json`).then((m) => m.default).catch(() => ({})),
  ]);

  let merged = deepMerge(rootMessages, common);
  merged = deepMerge(merged, marketing);
  merged = deepMerge(merged, auth);
  merged = deepMerge(merged, products);
  merged = deepMerge(merged, cart);
  merged = deepMerge(merged, profile);
  merged = deepMerge(merged, notifications);

  return merged;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await loadWebMessages(locale),
    onError(error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[next-intl] ${error.message}`);
      }
    },
    getMessageFallback({ key, namespace }) {
      return (
        {
          bannerDefaultSubtitle:
            locale === 'en'
              ? 'Ngoc Linh Ginseng is the national treasure of Vietnam, preserved with blockchain technology.'
              : 'Quốc bảo Sâm Ngọc Linh kết hợp công nghệ số hoá minh bạch.',
          exploreProducts: locale === 'en' ? 'Explore Products' : 'Khám Phá Sản Phẩm',
          ctaTitle:
            locale === 'en'
              ? 'Own & Sponsor Premium Ngoc Linh Ginseng'
              : 'Sở Hữu & Bảo Trợ Sâm Ngọc Linh Thượng Hạng',
          ctaSubtitle:
            locale === 'en'
              ? 'Join our transparent cultivation and conservation platform.'
              : 'Nền tảng tiên phong kết hợp bảo tồn sâm tự nhiên và định danh tài sản số.',
          heroBadge:
            locale === 'en'
              ? 'NATIONAL TREASURE — DIGITAL CULTIVATION'
              : 'QUỐC BẢO VIỆT NAM – SỐ HÓA CANH TÁC',
        }[key] || `${namespace ? `${namespace}.` : ''}${key}`
      );
    },
  };
});
