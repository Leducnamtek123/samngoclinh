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

async function loadWebMessages(locale: string) {
  let rootMessages = {};
  try {
    rootMessages = await import(`../locales/${locale}.json`).then((m) => m.default);
  } catch {}

  const [
    common,
    marketing,
    auth,
    products,
    cart,
    profile,
    notifications,
  ] = await Promise.all([
    import(`../locales/${locale}/common.json`).then((m) => m.default).catch(() => ({})),
    import(`../locales/${locale}/marketing.json`).then((m) => m.default).catch(() => ({})),
    import(`../locales/${locale}/auth.json`).then((m) => m.default).catch(() => ({})),
    import(`../locales/${locale}/products.json`).then((m) => m.default).catch(() => ({})),
    import(`../locales/${locale}/cart.json`).then((m) => m.default).catch(() => ({})),
    import(`../locales/${locale}/profile.json`).then((m) => m.default).catch(() => ({})),
    import(`../locales/${locale}/notifications.json`).then((m) => m.default).catch(() => ({})),
  ]);

  return {
    ...rootMessages,
    ...common,
    ...marketing,
    ...auth,
    ...products,
    ...cart,
    ...profile,
    ...notifications,
  };
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await loadWebMessages(locale),
  };
});
