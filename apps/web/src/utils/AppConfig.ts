import type { LocalePrefixMode } from 'next-intl/routing';

/** Locale prefix strategy for next-intl routing. */
const localePrefix: LocalePrefixMode = 'as-needed';

// FIXME: Customize this configuration for your product
/** Centralized application configuration */
export const AppConfig = {
  name: 'Rượu Sâm Ngọc Linh',
  i18n: {
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
    localePrefix,
  },
};
