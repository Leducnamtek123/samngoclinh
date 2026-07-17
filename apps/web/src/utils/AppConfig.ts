import { enUS, frFR } from '@clerk/localizations';
type LocalizationResource = any;
import type { LocalePrefixMode } from 'next-intl/routing';

/** Locale prefix strategy for next-intl routing. */
const localePrefix: LocalePrefixMode = 'as-needed';

// FIXME: Customize this configuration for your product
/** Centralized application configuration */
export const AppConfig = {
  name: 'Nextjs Starter',
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    localePrefix,
  },
};

const supportedLocales: Record<string, LocalizationResource> = {
  en: enUS,
  fr: frFR,
};

export const ClerkLocalizations = {
  defaultLocale: enUS,
  supportedLocales,
};
