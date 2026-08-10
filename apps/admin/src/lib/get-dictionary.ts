// Domain-driven dictionary loader
import "server-only"

import type { LocaleType } from "@/types"

async function loadLocaleDomains(locale: LocaleType) {
  const [
    auth,
    navigation,
    common,
    users,
    trees,
    products,
    packages,
    content,
    qrCode,
    messages,
    validation,
    label,
    search,
  ] = await Promise.all([
    import(`@/data/dictionaries/${locale}/auth.json`).then((m) => m.default),
    import(`@/data/dictionaries/${locale}/navigation.json`).then((m) => m.default),
    import(`@/data/dictionaries/${locale}/common.json`).then((m) => m.default),
    import(`@/data/dictionaries/${locale}/users.json`).then((m) => m.default),
    import(`@/data/dictionaries/${locale}/trees.json`).then((m) => m.default),
    import(`@/data/dictionaries/${locale}/products.json`).then((m) => m.default),
    import(`@/data/dictionaries/${locale}/packages.json`).then((m) => m.default),
    import(`@/data/dictionaries/${locale}/content.json`).then((m) => m.default),
    import(`@/data/dictionaries/${locale}/qrCode.json`).then((m) => m.default),
    import(`@/data/dictionaries/${locale}/messages.json`).then((m) => m.default),
    import(`@/data/dictionaries/${locale}/validation.json`).then((m) => m.default),
    import(`@/data/dictionaries/${locale}/label.json`).then((m) => m.default),
    import(`@/data/dictionaries/${locale}/search.json`).then((m) => m.default),
  ])

  return {
    auth,
    navigation,
    common,
    users,
    trees,
    products,
    packages,
    content,
    qrCode,
    messages,
    validation,
    label,
    search,
  }
}

export async function getDictionary(locale: LocaleType) {
  return loadLocaleDomains(locale)
}

export type DictionaryType = Awaited<ReturnType<typeof getDictionary>>
